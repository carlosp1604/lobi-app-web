'use client'

import * as Sentry from "@sentry/nextjs";
import PQueue from 'p-queue';
import {Result} from "~/types/Result";
import {injectLoggerOut, injectRefresher} from "~/helpers/api.helper";
import {AuthAction, AuthenticatedUser, authReducer, AuthStatus, initialState} from "~/context/AuthReducer";
import {AuthStore, performInit, performLogin, performLogout, performRefresh} from "~/context/AuthOperations";
import {
  createContext,
  useEffect,
  ReactNode,
  useRef,
  useReducer,
  useCallback,
  useMemo, useState
} from 'react';

interface AuthContextType {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  login: (email: string, password: string) => Promise<Result<void, string>>;
  refresh: () => Promise<Result<void, string>>;
  logout: () => Promise<Result<void, string>>;
  isLoginOpen: boolean;
  setLoginOpen: (open: boolean) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, reactDispatch] = useReducer(authReducer, initialState);
  const [isLoginOpen, setLoginOpen] = useState<boolean>(false);

  const stateRef = useRef(state);

  const dispatch = useCallback((action: AuthAction) => {
    const newState = authReducer(stateRef.current, action);

    stateRef.current = newState;

    reactDispatch(action);
  }, []);

  const getState = useCallback(() => stateRef.current, []);

  const store = useMemo<AuthStore>(() => ({ dispatch, getState }), [getState]);

  const [queue] = useState(() => new PQueue({ concurrency: 1 }));

  const login = (email: string, password: string) => {
    return queue.add(() => performLogin(store, email, password)) as Promise<Result<void, string>>;
  };

  const refresh = (failedAt?: number) => {
    return queue.add(() => performRefresh(store, failedAt)) as Promise<Result<void, string>>;
  };

  const logout = () => {
    return queue.add(() => performLogout(store)) as Promise<Result<void, string>>;
  };

  useEffect(() => {
    queue.add(() => performInit(store)).then()
  }, [queue, store]);

  useEffect(() => {
    injectRefresher(async (failedAt: number) => {
      const result = await refresh(failedAt);

      if (!result.success) {
        logout();
        return false;
      }

      return true;
    });

    injectLoggerOut(async () => {
      await logout();
    });
  }, [queue, store]);

  useEffect(() => {
    if (state.user && state.status === 'authenticated') {
      Sentry.setUser({
        id: state.user.id,
        username: state.user.username,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{
      status: state.status,
      user: state.user,
      login,
      refresh,
      logout,
      isLoginOpen,
      setLoginOpen,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

