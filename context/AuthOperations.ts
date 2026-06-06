import { Dispatch } from 'react'
import { LoginResponseDto } from '~/types/auth/dto/LoginResponseDto'
import { AuthContextService } from '~/services/auth/AuthContextService'
import { RefreshResponseDto } from '~/types/auth/dto/RefreshResponseDto'
import { AuthAction, AuthState } from '~/context/AuthReducer'
import { Result, success, fail } from '~/types/Result'

export interface AuthStore {
  dispatch: Dispatch<AuthAction>
  getState: () => AuthState
}

const cleanupStorage = () => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem('accessExpiresAt')
  localStorage.removeItem('refreshExpiresAt')
  localStorage.removeItem('userData')
}

const setupStorage = (data: LoginResponseDto | RefreshResponseDto) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem('accessExpiresAt', data.accessTokenExpiresAt)
  localStorage.setItem('refreshExpiresAt', data.refreshTokenExpiresAt)
  localStorage.setItem('userData', JSON.stringify(data.userData))
}

export const performLogin = async (
  store: AuthStore,
  email: string,
  password: string
): Promise<Result<void, string>> => {
  const state = store.getState()

  if (state.status === 'authenticated') {
    return fail('auth-login-user-already-logged-in')
  }

  store.dispatch({ type: 'SET_LOADING' })

  const service = new AuthContextService()
  const result = await service.login(email, password)

  if (result.success) {
    setupStorage(result.value)

    store.dispatch({ type: 'SET_AUTHENTICATED',  payload: { user: result.value.userData, lastUpdate: Date.now() } })

    return success(undefined)
  }

  cleanupStorage()
  store.dispatch({ type: 'SET_UNAUTHENTICATED' })

  return fail(result.error.getTranslationKey())
}

export const performRefresh = async (store: AuthStore, failedAt?: number): Promise<Result<void, string>> => {
  const state = store.getState()

  if (state.status === 'unauthenticated') {
    return fail('auth-refresh-aborted-no-session')
  }

  if (failedAt && state.lastUpdate > failedAt) {
    return success(undefined)
  }

  store.dispatch({ type: 'SET_LOADING' })

  const service = new AuthContextService()
  const result = await service.refresh()

  if (result.success) {
    setupStorage(result.value)

    store.dispatch({ type: 'SET_AUTHENTICATED', payload: { user: result.value.userData, lastUpdate: Date.now() } })

    return success(undefined)
  }

  cleanupStorage()
  store.dispatch({ type: 'SET_UNAUTHENTICATED' })

  return fail(result.error.getTranslationKey())
}

export const performLogout = async (store: AuthStore): Promise<Result<void, string>> => {
  const state = store.getState()

  if (state.status === 'unauthenticated') {
    return fail('auth-logout-user-is-not-logged-in')
  }

  store.dispatch({ type: 'SET_LOADING' })

  const service = new AuthContextService()

  await service.logout()

  cleanupStorage()
  store.dispatch({ type: 'SET_UNAUTHENTICATED' })

  return success(undefined)
}

export const performInit = async (store: AuthStore): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    store.dispatch({ type: 'SET_LOADING' })

    const accessAtRaw = localStorage.getItem('accessExpiresAt')
    const refreshAtRaw = localStorage.getItem('refreshExpiresAt')
    const userRaw = localStorage.getItem('userData')

    if (!accessAtRaw || !refreshAtRaw || !userRaw) {
      cleanupStorage()
      store.dispatch({ type: 'SET_UNAUTHENTICATED' })

      return
    }

    const now = Date.now()
    const accessTime = Date.parse(accessAtRaw)
    const refreshTime = Date.parse(refreshAtRaw)

    if (isNaN(accessTime) || isNaN(refreshTime)) {
      cleanupStorage()
      store.dispatch({ type: 'SET_UNAUTHENTICATED' })

      return
    }

    const parsedUser = JSON.parse(userRaw)

    if (
      !parsedUser?.id ||
      !parsedUser?.username ||
      !parsedUser?.name ||
      parsedUser?.imageUrl === undefined
    ) {
      cleanupStorage()
      store.dispatch({ type: 'SET_UNAUTHENTICATED' })

      return
    }

    if (now >= refreshTime) {
      cleanupStorage()
      store.dispatch({ type: 'SET_UNAUTHENTICATED' })

      return
    }

    if (now < accessTime) {
      store.dispatch({
        type: 'SET_AUTHENTICATED',
        payload: { user: parsedUser, lastUpdate: Date.now() },
      })

      return
    }

    const service = new AuthContextService()
    const result = await service.refresh()

    if (result.success) {
      setupStorage(result.value)
      store.dispatch({
        type: 'SET_AUTHENTICATED',
        payload: { user: result.value.userData, lastUpdate: Date.now() },
      })

      return
    }

    const error = result.error
    const isNetworkError = error.infrastructure.type === 'network'
    const isServerError =
      error.infrastructure.type === 'api' &&
      error.infrastructure.statusCode &&
      error.infrastructure.statusCode >= 500

    if (isNetworkError || isServerError) {
      console.warn('Network or Server Error during token refresh. Hydrating with stale data.')

      store.dispatch({
        type: 'SET_AUTHENTICATED',
        payload: { user: parsedUser, lastUpdate: Date.now() },
      })
    } else {
      cleanupStorage()
      store.dispatch({ type: 'SET_UNAUTHENTICATED' })
    }

  } catch {
    cleanupStorage()
    store.dispatch({ type: 'SET_UNAUTHENTICATED' })
  }
}
