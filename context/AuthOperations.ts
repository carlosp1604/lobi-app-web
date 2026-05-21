import {AuthAction, AuthState} from "~/context/AuthReducer";
import {LoginResponseDto} from "~/types/auth/dto/LoginResponseDto";
import {RefreshResponseDto} from "~/types/auth/dto/RefreshResponseDto";
import {Dispatch} from "react";
import {fail, Result, success} from "~/types/Result";
import {AuthContextService} from "~/services/auth/AuthContextService";

export interface AuthStore {
  dispatch: Dispatch<AuthAction>;
  getState: () => AuthState;
}

const cleanupStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('accessExpiresAt');
  localStorage.removeItem('refreshExpiresAt');
  localStorage.removeItem('userData');
};

const setupStorage = (data: LoginResponseDto | RefreshResponseDto) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('accessExpiresAt', data.accessTokenExpiresAt);
  localStorage.setItem('refreshExpiresAt', data.refreshTokenExpiresAt);
  localStorage.setItem('userData', JSON.stringify(data.userData));
};

export const performLogin = async (
  store: AuthStore,
  email: string,
  password: string
): Promise<Result<void, string>> => {
  const state = store.getState();

  if (state.status === 'authenticated') {
    return fail('auth-login-user-already-logged-in');
  }

  store.dispatch({ type: 'SET_LOADING' });

  const service = new AuthContextService();
  const result = await service.login(email, password);

  if (result.success) {
    setupStorage(result.value);

    store.dispatch({ type: 'SET_AUTHENTICATED',  payload: { user: result.value.userData, lastUpdate: Date.now() }});

    return success(undefined);
  }

  cleanupStorage();
  store.dispatch({ type: 'SET_UNAUTHENTICATED' });

  return fail(result.error.key);
};

export const performRefresh = async (store: AuthStore, failedAt?: number): Promise<Result<void, string>> => {
  const state = store.getState();

  if (state.status === 'unauthenticated') {
    return fail('auth-refresh-aborted-no-session');
  }

  if (failedAt && state.lastUpdate > failedAt) {
    return success(undefined);
  }

  store.dispatch({ type: 'SET_LOADING' });

  const service = new AuthContextService();
  const result = await service.refresh();

  if (result.success) {
    setupStorage(result.value);

    store.dispatch({ type: 'SET_AUTHENTICATED', payload: { user: result.value.userData, lastUpdate: Date.now() }});

    return success(undefined);
  }

  cleanupStorage();
  store.dispatch({ type: 'SET_UNAUTHENTICATED' });

  return fail(result.error.key);
};

export const performLogout = async (store: AuthStore): Promise<Result<void, string>> => {
  const state = store.getState();

  if (state.status === 'unauthenticated') {
    return fail('auth-logout-user-is-not-logged-in');
  }

  store.dispatch({ type: 'SET_LOADING' });

  const service = new AuthContextService();
  await service.logout();

  cleanupStorage();
  store.dispatch({ type: 'SET_UNAUTHENTICATED' });

  return success(undefined);
};

export const performInit = async (store: AuthStore): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    store.dispatch({ type: 'SET_LOADING' });

    const accessAtRaw = localStorage.getItem('accessExpiresAt');
    const refreshAtRaw = localStorage.getItem('refreshExpiresAt');
    const userRaw = localStorage.getItem('userData');

    if (!accessAtRaw || !refreshAtRaw || !userRaw) {
      throw new Error('Missing credentials');
    }

    const now = Date.now();
    const accessTime = Date.parse(accessAtRaw);
    if (isNaN(accessTime)) {
      throw new Error('Invalid access token date');
    }

    if (now >= accessTime) {
      const refreshTime = Date.parse(refreshAtRaw);

      if (isNaN(refreshTime) || now >= refreshTime) {
        throw new Error('Refresh token expired');
      }

      const service = new AuthContextService();
      const result = await service.refresh();

      if (result.success) {
        setupStorage(result.value);
        store.dispatch({
          type: 'SET_AUTHENTICATED',
          payload: { user: result.value.userData, lastUpdate: Date.now() }
        });
      } else {
        throw new Error('Initial refresh failed');
      }
      return;
    }

    const parsedUser = JSON.parse(userRaw);
    if (
      !parsedUser?.id ||
      !parsedUser?.username ||
      !parsedUser?.name ||
      parsedUser?.imageUrl === undefined
    ) {
      throw new Error('Invalid user payload');
    }

    store.dispatch({ type: 'SET_AUTHENTICATED', payload: { user: parsedUser, lastUpdate: Date.now()} });
  } catch (exception: unknown) {
    cleanupStorage();
    store.dispatch({ type: 'SET_UNAUTHENTICATED' });
  }
};
