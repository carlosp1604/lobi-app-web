import { z } from 'zod';
import {ApiErrorSchema} from '~/types/ApiError.schema';
import { fail, Result, success } from '~/types/Result';
import { AxiosInstance, AxiosRequestConfig, isAxiosError, AxiosResponse } from 'axios';

type SUPPORTED_METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const ERR_UNKNOWN_CLIENT_CRASH = 'ERR_UNKNOWN_CLIENT_CRASH' as const;
const UNKNOWN_ERROR_NETWORK = 'UNKNOWN_ERROR_NETWORK' as const;

const RESPONSE_FORMAT_VALIDATION_ERROR = 'RESPONSE_FORMAT_VALIDATION_ERROR' as const;
const ERROR_FORMAT_VALIDATION_ERROR = 'ERROR_FORMAT_VALIDATION_ERROR' as const;
const ERROR_RESPONSE_FORMAT_VALIDATION_ERROR = 'ERROR_RESPONSE_FORMAT_VALIDATION_ERROR' as const;

export type ApiClientErrorEnvelope =
  | {
  readonly type: 'api';
  readonly statusCode: number;
  readonly timestamp?: string;
  readonly requestId: string;
  readonly path: string;
  readonly method: SUPPORTED_METHODS;
  readonly response: unknown;
}
  | {
  readonly type: 'network';
  readonly code: string;
  readonly path: string;
  readonly method: SUPPORTED_METHODS;
  readonly error: unknown;
}
  | {
  readonly type: 'validation';
  readonly code: string
  readonly statusCode: number;
  readonly timestamp?: string;
  readonly requestId: string;
  readonly path: string;
  readonly method: SUPPORTED_METHODS;
  readonly response: unknown;
  readonly error: z.ZodError;
};

export class ApiClient {
  constructor(private readonly api: AxiosInstance) {}

  async get<T>(
    url: string,
    dataSchema: z.ZodType<T>,
    errorSchema: z.ZodSchema,
    config?: AxiosRequestConfig
  ): Promise<Result<T, ApiClientErrorEnvelope>> {
    try {
      const response = await this.api.get<unknown>(url, config);

      const rawData = response.data;

      const validation = dataSchema.safeParse(rawData);

      if (!validation.success) {
        return fail(this.buildResponseValidationError(response, url, 'GET', validation.error));
      }

      return success(validation.data);
    } catch (error: unknown) {
      return fail(this.buildResponseError(error, url, 'GET', errorSchema));
    }
  }

  async post<T>(
    url: string,
    schema: z.ZodType<T>,
    errorSchema: z.ZodSchema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T, ApiClientErrorEnvelope>> {
    try {
      const response = await this.api.post<unknown>(url, payload, config);
      const rawData = response.data;

      const validation = schema.safeParse(rawData);

      if (!validation.success) {
        return fail(this.buildResponseValidationError(response, url, 'POST', validation.error));
      }

      return success(validation.data);
    } catch (error: unknown) {
      return fail(this.buildResponseError(error, url, 'POST', errorSchema));
    }
  }

  async delete(
    url: string,
    errorSchema: z.ZodSchema,
    config?: AxiosRequestConfig,
  ): Promise<Result<void, ApiClientErrorEnvelope>> {
    try {
      await this.api.delete<unknown>(url, config);

      return success(undefined);
    } catch (error: unknown) {
      return fail(this.buildResponseError(error, url, 'DELETE', errorSchema));
    }
  }

  private buildResponseValidationError(
    response: AxiosResponse<unknown>,
    url: string,
    method: SUPPORTED_METHODS,
    error: z.ZodError
  ): ApiClientErrorEnvelope {
    const rawData = response.data;

    return {
      type: 'validation',
      code: RESPONSE_FORMAT_VALIDATION_ERROR,
      statusCode: response.status,
      requestId: (response.headers?.['x-request-id'] as string) || 'unknown',
      path: url,
      method,
      response: rawData,
      error,
    };
  }

  private buildResponseError (
    error: unknown,
    url: string,
    method: SUPPORTED_METHODS,
    schema: z.ZodSchema,
  ): ApiClientErrorEnvelope {
    if (!isAxiosError(error)) {
      return {
        type: 'network',
        code: ERR_UNKNOWN_CLIENT_CRASH,
        path: url,
        method,
        error,
      };
    }

    const axiosError = error;

    if (axiosError.response) {
      const serverData = axiosError.response.data;

      const errorValidation = ApiErrorSchema.safeParse(serverData)
      if (errorValidation.success) {
        const responseValidation = schema.safeParse(serverData.response);

        if (!responseValidation.success) {
          return {
            type: 'validation',
            code: ERROR_RESPONSE_FORMAT_VALIDATION_ERROR,
            timestamp: serverData.timestamp,
            statusCode: serverData.statusCode,
            requestId: serverData.requestId,
            path: url,
            method,
            response: serverData.response,
            error: responseValidation.error,
          }
        }

        return {
          type: 'api',
          statusCode: serverData.statusCode,
          timestamp: serverData.timestamp,
          requestId: serverData.requestId,
          path: serverData.path,
          method,
          response: serverData.response
        };
      }

      return {
        type: 'validation',
        code: ERROR_FORMAT_VALIDATION_ERROR,
        statusCode: axiosError.response.status,
        requestId: (axiosError.response.headers?.['x-request-id'] as string) || 'unknown',
        path: url,
        method,
        response: serverData,
        error: errorValidation.error,
      }
    }

    return {
      type: 'network',
      code: axiosError.code || UNKNOWN_ERROR_NETWORK,
      path: url,
      method,
      error,
    };
  }
}
