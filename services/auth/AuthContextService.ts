import { ApiClient } from '~/helpers/ApiClient'
import { authClient } from '~/helpers/api.helper'
import { EmptyResponseSchema } from '~/types/shared/dto/EmptyResponseDto'
import { Result, success, fail } from '~/types/Result'
import { reportApiErrorToSentry } from '~/helpers/sentry.helper'
import {
  StandardApiErrorResponseDto,
  StandardApiErrorResponseSchema
} from '~/types/shared/dto/StandardApiErrorResponseDto'
import { LoginResponseDto, LoginResponseSchema } from '~/types/auth/dto/LoginResponseDto'
import { RefreshResponseDto, RefreshResponseSchema } from '~/types/auth/dto/RefreshResponseDto'
import { AppServiceError } from '~/types/AppServiceError'
import { UNAUTHORIZED_ACCESS } from '~/types/shared/ApiCodes'

export class AuthContextService {
  private readonly apiClient = new ApiClient(authClient)

  public async login(
    email: string,
    password: string
  ): Promise<Result<LoginResponseDto, AppServiceError>> {
    const payload = { email, password }

    const result = await this.apiClient.post(
      '/auth/login',
      LoginResponseSchema,
      StandardApiErrorResponseSchema,
      payload
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [UNAUTHORIZED_ACCESS]: 'api-errors:login_invalid_credentials_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope, payload)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async refresh(): Promise<Result<RefreshResponseDto, AppServiceError>> {
    const result = await this.apiClient.post<RefreshResponseDto>(
      '/auth/refresh',
      RefreshResponseSchema,
      StandardApiErrorResponseSchema
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [UNAUTHORIZED_ACCESS]: 'api-errors:user_session_is_not_longer_valid_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async logout(): Promise<Result<void, AppServiceError>> {
    const result = await this.apiClient.post<void>(
      '/auth/logout',
      EmptyResponseSchema,
      StandardApiErrorResponseSchema
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto
    const errorCode = errorResponse?.code || 'unknown-error'

    reportApiErrorToSentry(envelope)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }
}
