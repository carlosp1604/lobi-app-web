import {fail, Result, success} from "~/types/Result";
import {publicClient} from "~/helpers/api.helper";
import {ServiceError, ServiceErrorLegacy} from "~/types/ServiceError";
import {VerificationTokenPurpose} from "~/types/auth/VerificationTokenPurpose";
import {SignupApiErrorResponseDto, StandardApiErrorResponseDto} from "~/types/auth/dto/ApiErrorResponseDto";
import {ApiClient} from "~/helpers/ApiClient";
import {
  AUTH_CREATE_USER_DUPLICATED_EMAIL,
  AUTH_CREATE_USER_DUPLICATED_USERNAME,
  AUTH_CREATE_USER_TOKEN_ALREADY_USED,
  AUTH_RESET_PASSWORD_SAME_PASSWORD,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED
} from "~/types/auth/ApiCodes";
import {UserRole} from "~/types/UserRole";
import {reportApiErrorToSentry} from "~/helpers/sentry.helper";

export class AuthService {
  /** Public client | without credentials **/
  private readonly apiClient = new ApiClient(publicClient);

  public async verifyEmailReset(email: string, sendNewToken: boolean): Promise<Result<void, ServiceError>> {
    const result = await this.apiClient.post<void, StandardApiErrorResponseDto>('/auth/verify-email/reset', {
      email,
      sendNewToken
    });

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';
    const statusCode = result.error.statusCode

    switch (statusCode) {
      case 409:
        return fail({
          key: 'api-errors:verify_email_email_already_sent_message_title',
          apiCode: errorCode
        })

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/verify-email/reset`,
          method: 'POST',
          body: { email, sendNewToken }
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: errorCode
        })
      }
    }
  }

  public async verifyEmailSignup(email: string, sendNewToken: boolean): Promise<Result<void, ServiceError>> {
    const result = await this.apiClient.post<void, StandardApiErrorResponseDto>('/auth/verify-email/signup', {
      email,
      sendNewToken
    });

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';
    const statusCode = result.error.statusCode

    switch (statusCode) {
      case 409:
        return fail({
          key: 'api-errors:verify_email_email_address_already_taken_message_title',
          apiCode: errorCode
        })

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/verify-email/signup`,
          method: 'POST',
          body: { email, sendNewToken }
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: errorCode
        })
      }
    }
  }

  public async validateToken(email: string, purpose: VerificationTokenPurpose, token: string): Promise<Result<void, ServiceError>> {
    const result = await this.apiClient.post<void, StandardApiErrorResponseDto>('/auth/validate-token', {
      email,
      token,
      purpose
    });

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';
    const statusCode = result.error.statusCode

    switch (statusCode) {
      case 409:
        return fail({
          key: 'api-errors:validate_token_token_already_used_message_title',
          apiCode: errorCode
        })

      case 410:
        return fail({
          key: 'api-errors:validate_token_token_already_expired_message_title',
          apiCode: errorCode
        })

      case 404:
        return fail({
          key: 'api-errors:validate_token_invalid_token_message_title',
          apiCode: errorCode
        })

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/validate-token`,
          method: 'POST',
          body: { email, purpose, token }
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: errorCode
        })
      }
    }
  }

  public async resetPassword(email: string, token: string, password: string): Promise<Result<void, ServiceError>> {
    const result = await this.apiClient.post<void, StandardApiErrorResponseDto>('/auth/reset-password', {
      email,
      token,
      password
    });

    if (result.success) {
      return success(result.value)
    }

    const errorCode = result.error.response?.code || 'unknown-error';
    const statusCode = result.error.statusCode

    switch (statusCode) {
      case 404:
        return fail({
          key: 'api-errors:reset_password_invalid_token_message_title',
          apiCode: errorCode
        })

      case 410:
        return fail({
          key: 'api-errors:reset_password_token_already_expired_message_title',
          apiCode: errorCode
        })

      case 409: {
        if (errorCode === AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED) {
          return fail({ key: 'api-errors:reset_password_token_already_used_message_title', apiCode: errorCode })
        }

        if (errorCode === AUTH_RESET_PASSWORD_SAME_PASSWORD) {
          return fail({ key: 'api-errors:same_password_message_title', apiCode: errorCode })
        }

        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/reset-password`,
          method: 'POST',
          body: { email, token, password }
        });

        return fail({ key: 'api-errors:unexpected-server-error', apiCode: errorCode })
      }

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/reset-password`,
          method: 'POST',
          body: { email, token, password }
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: errorCode
        })
      }
    }
  }

  public async signup(
    email: string,
    name: string,
    username: string,
    token: string,
    password: string,
    requestedRole: UserRole,
  ): Promise<Result<void, ServiceErrorLegacy>> {
    const result = await this.apiClient.post<void, SignupApiErrorResponseDto>('/auth/signup', {
      email,
      username,
      name,
      password,
      token,
      requestedRole,
    });

    if (result.success) {
      return success(result.value);
    }

    const statusCode = result.error.statusCode;
    const body = result.error.response;
    const globalErrorCode = 'code' in body ? body.code : 'unknown-error';

    switch (statusCode) {
      case 404:
        return fail({
          key: 'api-errors:signup_invalid_token_message_title',
          apiCode: globalErrorCode,
        });

      case 410:
        return fail({
          key: 'api-errors:signup_token_already_expired_message_title',
          apiCode: globalErrorCode,
        });

      case 409: {
        if (globalErrorCode === AUTH_CREATE_USER_TOKEN_ALREADY_USED) {
          return fail({
            key: 'api-errors:signup_token_already_used_message_title',
            apiCode: globalErrorCode
          });
        }

        if ('errors' in body && Array.isArray(body?.errors)) {
          const errorCodes = body.errors.map((e: StandardApiErrorResponseDto) => e.code);

          const errors: Array<ServiceError> = [];

          if (errorCodes.includes(AUTH_CREATE_USER_DUPLICATED_USERNAME)) {
            errors.push({
              key: 'api-errors:signup_username_taken_title',
              apiCode: AUTH_CREATE_USER_DUPLICATED_USERNAME,
            })
          }

          if (errorCodes.includes(AUTH_CREATE_USER_DUPLICATED_EMAIL)) {
            errors.push({
              key: 'api-errors:signup_email_taken_title',
              apiCode: AUTH_CREATE_USER_DUPLICATED_EMAIL,
            });
          }

          return fail({ errors })
        }

        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/signup`,
          method: 'POST',
          body: { email, name, username, token, password, requestedRole }
        });

        return fail({ key: 'api-errors:unexpected-server-error', apiCode: globalErrorCode });
      }

      default: {
        reportApiErrorToSentry(result.error, {
          url: `${this.apiClient.baseUrl}/auth/signup`,
          method: 'POST',
          body: { email, name, username, token, password, requestedRole }
        });

        return fail({
          key: 'api-errors:unexpected-server-error',
          apiCode: globalErrorCode,
        });
      }
    }
  }
}
