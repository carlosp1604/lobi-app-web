import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import {fail, Result, success} from "~/types/Result";

export interface ApiErrorEnvelope<E = unknown> {
  statusCode: number;
  timestamp: string;
  requestId: string;
  path: string;
  response: E;
}

const buildApiError = <E>(error: unknown, url: string): ApiErrorEnvelope<E> => {
  const axiosError = error as AxiosError<ApiErrorEnvelope<E>>;
  const serverData = axiosError.response?.data;

  return {
    statusCode: serverData?.statusCode || axiosError.response?.status || 500,
    requestId: serverData?.requestId || (axiosError.response?.headers?.['x-request-id'] as string) || 'no-request-id',
    path: serverData?.path || url,
    timestamp: serverData?.timestamp || new Date().toISOString(),
    response: serverData?.response || ({
      code: 'internal-server-error',
      message: axiosError.message || 'Unexpected server error'
    } as unknown as E)
  };
};

export class ApiClient {
  constructor(private readonly api: AxiosInstance) {}

  public get baseUrl(): string {
    return this.api.defaults.baseURL ?? ''
  }

  async get<T, E = unknown>(url: string, config?: AxiosRequestConfig): Promise<Result<T, ApiErrorEnvelope<E>>> {
    try {
      const { data } = await this.api.get<T>(url, config);
      return success(data);
    } catch (error: unknown) {
      return fail(buildApiError<E>(error, url));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T, E = unknown>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<Result<T, ApiErrorEnvelope<E>>> {
    try {
      const { data } = await this.api.post<T>(url, payload, config);
      return success(data);
    } catch (error: unknown) {
      return fail(buildApiError<E>(error, url));
    }
  }
}
