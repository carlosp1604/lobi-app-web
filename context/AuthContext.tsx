'use client'

import {
  createContext,
  useEffect,
  ReactNode,
  useRef,
  useReducer,
  useCallback,
  useMemo, useState
} from 'react';
import {AuthenticatedUser, authReducer, AuthStatus, initialState} from "~/context/AuthReducer";
import {AuthStore, performInit, performLogin, performLogout, performRefresh} from "~/context/AuthOperations";
import PQueue from 'p-queue';
import {Result} from "~/types/Result";
import {injectRefresher} from "~/helpers/api.helper";
import * as Sentry from "@sentry/nextjs";

interface AuthContextType {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  login: (email: string, password: string) => Promise<Result<void, string>>;
  refresh: () => Promise<Result<void, string>>;
  logout: () => Promise<Result<void, string>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
    queue.add(() => performInit(store));
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
  }, [queue, store]);

  useEffect(() => {
    if (state.user && state.status === 'authenticated') {
      Sentry.setContext('User',{
        id: state.user.id,
        username: state.user.username,
      });
    } else {
      Sentry.setContext('User', null);
    }
  }, [state.user, state.status]);

  return (
    <AuthContext.Provider value={{ status: state.status, user: state.user, login, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

