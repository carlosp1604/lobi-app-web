import { fail, Result, success } from '~/types/Result'
import { protectedClient, publicClient } from '~/helpers/api.helper'
import { VerificationTokenPurpose } from '~/types/auth/VerificationTokenPurpose'
import { ApiClient } from '~/helpers/ApiClient'
import { UserRole } from '~/types/users/UserRole'
import { reportApiErrorToSentry } from '~/helpers/sentry.helper'
import {
  GetUserSecurityDetailsQueryResponseDto,
  GetUserSecurityDetailsQueryResponseSchema
} from '~/types/auth/dto/GetUserSecurityDetailsResponseDto'
import {
  ApiErrorResponseDto,
  ApiErrorResponseSchema,
  StandardApiErrorResponseDto,
  StandardApiErrorResponseSchema
} from '~/types/shared/dto/StandardApiErrorResponseDto'
import {
  AUTH_CREATE_USER_INVALID_TOKEN,
  AUTH_CREATE_USER_TOKEN_ALREADY_EXPIRED,
  AUTH_CREATE_USER_TOKEN_ALREADY_USED,
  AUTH_RESET_PASSWORD_INVALID_TOKEN,
  AUTH_RESET_PASSWORD_SAME_PASSWORD,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_EXPIRED,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED,
  AUTH_VALIDATE_TOKEN_ALREADY_EXPIRED,
  AUTH_VALIDATE_TOKEN_ALREADY_USED,
  AUTH_VALIDATE_TOKEN_INVALID_TOKEN,
  AUTH_VERIFY_EMAIL_EMAIL_ALREADY_TAKEN,
  AUTH_VERIFY_EMAIL_TOKEN_ALREADY_ISSUED
} from '~/types/auth/ApiCodes'
import { AppServiceError, FieldErrorDetail } from '~/types/AppServiceError'
import { EmptyResponseSchema } from '~/types/shared/dto/EmptyResponseDto'
import { UNAUTHORIZED_ACCESS } from '~/types/shared/ApiCodes'

export class AuthService {
  private readonly publicApiClient = new ApiClient(publicClient)
  private readonly protectedApiClient = new ApiClient(protectedClient)

  public async verifyEmailReset(
    email: string,
    sendNewToken: boolean
  ): Promise<Result<void, AppServiceError>> {
    const payload = { email, sendNewToken }

    const result = await this.publicApiClient.post<void>(
      '/auth/verify-email/reset',
      EmptyResponseSchema,
      StandardApiErrorResponseSchema,
      payload
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope, payload)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [AUTH_VERIFY_EMAIL_TOKEN_ALREADY_ISSUED]: 'api-errors:verify_email_email_already_sent_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope, payload)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async verifyEmailSignup(
    email: string,
    sendNewToken: boolean
  ): Promise<Result<void, AppServiceError>> {
    const payload = { email, sendNewToken }

    const result = await this.publicApiClient.post<void>(
      '/auth/verify-email/signup',
      EmptyResponseSchema,
      StandardApiErrorResponseSchema,
      payload
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope, payload)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [AUTH_VERIFY_EMAIL_EMAIL_ALREADY_TAKEN]: 'api-errors:verify_email_email_address_already_taken_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope, payload)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async validateToken(
    email: string,
    purpose: VerificationTokenPurpose,
    token: string
  ): Promise<Result<void, AppServiceError>> {
    const payload = { email, token, purpose }

    const result = await this.publicApiClient.post<void>(
      '/auth/validate-token',
      EmptyResponseSchema,
      StandardApiErrorResponseSchema,
      payload
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope, payload)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [AUTH_VALIDATE_TOKEN_ALREADY_USED]: 'api-errors:validate_token_token_already_used_message_title',
      [AUTH_VALIDATE_TOKEN_ALREADY_EXPIRED]: 'api-errors:validate_token_token_already_expired_message_title',
      [AUTH_VALIDATE_TOKEN_INVALID_TOKEN]: 'api-errors:validate_token_invalid_token_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope, payload)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async resetPassword(
    email: string,
    token: string,
    password: string
  ): Promise<Result<void, AppServiceError>> {
    const payload = { email, token, password }

    const result = await this.publicApiClient.post<void>(
      '/auth/reset-password',
      EmptyResponseSchema,
      ApiErrorResponseSchema,
      payload
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope, payload)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as ApiErrorResponseDto
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [AUTH_RESET_PASSWORD_INVALID_TOKEN]: 'api-errors:reset_password_invalid_token_message_title',
      [AUTH_RESET_PASSWORD_TOKEN_ALREADY_EXPIRED]: 'api-errors:reset_password_token_already_expired_message_title',
      [AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED]: 'api-errors:reset_password_token_already_used_message_title',
      [AUTH_RESET_PASSWORD_SAME_PASSWORD]: 'api-errors:reset_password_same_password_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope, payload)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async signup(
    email: string,
    name: string,
    username: string,
    token: string,
    password: string,
    requestedRole: UserRole
  ): Promise<Result<void, AppServiceError>> {
    const payload = { email, username, name, password, token, requestedRole }

    const result = await this.publicApiClient.post<void>(
      '/auth/signup',
      EmptyResponseSchema,
      ApiErrorResponseSchema,
      payload
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope, payload)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const apiResponse = envelope.response as ApiErrorResponseDto
    const errorCode = apiResponse.code

    if ('errors' in apiResponse) {
      const fields: Record<string, FieldErrorDetail> = {}

      const fieldTranslations: Record<string, string> = {
        username: 'api-errors:signup_username_taken_message_title',
        email: 'api-errors:signup_email_taken_message_title',
      }

      apiResponse.errors.forEach((errorItem) => {
        const translationKey = fieldTranslations[errorItem.field]

        if (translationKey && errorItem.type === 'conflict') {
          fields[errorItem.field] = { key: translationKey, type: 'conflict' }
        }
      })

      if (Object.keys(fields).length > 0) {
        return fail(
          AppServiceError.createForm(
            'api-errors:form_contains_errors_message_title',
            errorCode,
            fields,
            envelope
          )
        )
      }
    }

    const errorTranslations: Record<string, string> = {
      [AUTH_CREATE_USER_TOKEN_ALREADY_USED]: 'api-errors:signup_token_already_used_message_title',
      [AUTH_CREATE_USER_TOKEN_ALREADY_EXPIRED]: 'api-errors:signup_token_already_expired_message_title',
      [AUTH_CREATE_USER_INVALID_TOKEN]: 'api-errors:signup_invalid_token_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope, payload)

    return fail(AppServiceError.createStandard('api-errors:unexpected_server_error_message_title', errorCode, envelope))
  }

  public async getUserSecurityDetails(): Promise<Result<GetUserSecurityDetailsQueryResponseDto, AppServiceError>> {
    const result = await this.protectedApiClient.get<GetUserSecurityDetailsQueryResponseDto>(
      '/auth/security-details',
      GetUserSecurityDetailsQueryResponseSchema,
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

  public async revokeSession(sessionId: string): Promise<Result<void, AppServiceError>> {
    const result = await this.protectedApiClient.delete(
      `/auth/sessions/${sessionId}/`,
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
}
