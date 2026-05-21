import {ApiClient} from "~/helpers/ApiClient";
import {authClient} from "~/helpers/api.helper";
import {ServiceError} from "~/types/ServiceError";
import {LoginResponseDto} from "~/types/auth/dto/LoginResponseDto";
import {RefreshResponseDto} from "~/types/auth/dto/RefreshResponseDto";
import {Result, success, fail} from "~/types/Result";
import {StandardApiErrorResponseDto} from "~/types/auth/dto/ApiErrorResponseDto";
import {reportApiErrorToSentry} from "~/helpers/sentry.helper";

export class AuthContextService {
  private readonly apiClient = new ApiClient(authClient);

  public async login(email: string, password: string): Promise<Result<LoginResponseDto, ServiceError>> {
    const result = await this.apiClient.post<LoginResponseDto, StandardApiErrorResponseDto>('/auth/login', {
      email,
      password
    });

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';
    const statusCode = result.error.statusCode

    switch (statusCode) {
      case 401:
        return fail({
          key: 'api-errors:login_invalid_credentials_message_title',
          apiCode: errorCode
        })

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/login`,
          method: 'POST',
          body: { email, password }
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: errorCode
        })
      }
    }
  }

  public async refresh(): Promise<Result<RefreshResponseDto, ServiceError>> {
    const result = await this.apiClient.post<RefreshResponseDto, StandardApiErrorResponseDto>('/auth/refresh');

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';
    const statusCode = result.error.statusCode

    switch (statusCode) {
      case 401:
        return fail({
          key: 'api-errors:refresh_invalid_credentials_message_title',
          apiCode: errorCode
        })

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/refresh`,
          method: 'POST',
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: errorCode
        })
      }
    }
  }

  public async logout(): Promise<Result<void, ServiceError>> {
    const result = await this.apiClient.post<void, StandardApiErrorResponseDto>('/auth/logout');

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';

    reportApiErrorToSentry(result.error, {
      url: `${this.apiClient.baseUrl}/auth/logout`,
      method: 'POST',
    });

    return fail({
      key: 'api-errors:unexpected-server-error',
      apiCode: errorCode
    })
  }
}
