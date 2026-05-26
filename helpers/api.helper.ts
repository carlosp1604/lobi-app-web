import axios, {AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const invalidatedSessionHeaderName = process.env.NEXT_PUBLIC_INVALIDATED_SESSION_HEADER_NAME ?? '';

const withRetry = (client: AxiosInstance) => {
  axiosRetry(client, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      const isServerError = error.response?.status ? error.response.status >= 500 : false;
      return axiosRetry.isNetworkError(error) || isServerError;
    },
  });
  return client;
};

export const publicClient = withRetry(
  axios.create({
    baseURL: baseUrl,
    withCredentials: false,
  })
);

export const authClient = withRetry(
  axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  })
);

export const protectedClient = withRetry(
  axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  })
);

let refreshDelegate: ((failedAt: number) => Promise<boolean>) | null = null;
let logoutDelegate: (() => Promise<void>) | null = null;

export const injectRefresher = (delegate: (failedAt: number) => Promise<boolean>) => {
  refreshDelegate = delegate;
};

export const injectLoggerOut = (delegate: () => Promise<void>) => {
  logoutDelegate = delegate;
};

protectedClient.interceptors.response.use((response) => response,
  async (error: AxiosError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalRequest = error.config as any;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.headers[invalidatedSessionHeaderName] === 'true') {
      if (!logoutDelegate) {
        return Promise.reject(error);
      }

      await logoutDelegate();
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshDelegate) {
        return Promise.reject(error);
      }

      const failedAt = Date.now();
      const isRefreshSuccess = await refreshDelegate(failedAt);

      if (!isRefreshSuccess) {
        return Promise.reject(error);
      }

      return protectedClient(originalRequest);
    }

    return Promise.reject(error);
  }
);
