export type AuthStatus = 'unauthenticated' | 'loading' | 'authenticated'

export interface AuthenticatedUser {
  id: string
  name: string
  username: string
  imageUrl: string | null
}

export interface AuthState {
  status: AuthStatus
  user: AuthenticatedUser | null
  lastUpdate: number
}

export type AuthAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_AUTHENTICATED'; payload: { user: AuthenticatedUser; lastUpdate: number } }
  | { type: 'SET_UNAUTHENTICATED' }

export const initialState: AuthState = {
  status: 'loading',
  user: null,
  lastUpdate: 0,
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, status: 'loading' }
    case 'SET_AUTHENTICATED':
      return { status: 'authenticated', user: action.payload.user, lastUpdate: action.payload.lastUpdate }
    case 'SET_UNAUTHENTICATED':
      return { status: 'unauthenticated', user: null, lastUpdate: 0 }
    default:
      return state
  }
}
