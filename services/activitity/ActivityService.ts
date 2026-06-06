import { fail, Result, success } from '~/types/Result'
import { protectedClient, publicClient } from '~/helpers/api.helper'
import { AppServiceError, FieldErrorDetail } from '~/types/AppServiceError'
import { ApiClient } from '~/helpers/ApiClient'
import { reportApiErrorToSentry } from '~/helpers/sentry.helper'
import {
  ApiErrorResponseDto,
  ApiErrorResponseSchema, NotificationErrorResponseDto,
  StandardApiErrorResponseDto,
  StandardApiErrorResponseSchema
} from '~/types/shared/dto/StandardApiErrorResponseDto'
import {
  GetSportsQueryResponseDto,
  GetSportsQueryResponseDtoSchema
} from '~/types/activity/dto/GetSportsQueryResponseDto'
import {
  CreateActivityCommandResponseDto, CreateActivityCommandResponseSchema
} from '~/types/activity/dto/CreateActivityResponseDto'
import { UNAUTHORIZED_ACCESS } from '~/types/shared/ApiCodes'
import {
  CANCEL_ACTIVITY_ACTIVITY_NOT_FOUND,
  CANCEL_ACTIVITY_ACTIVITY_STATUS_DOES_NOT_ALLOW_CANCEL, CANCEL_ACTIVITY_ACTIVITY_WITH_PARTICIPANTS_CANNOT_BE_CANCELLED,
  CANCEL_ACTIVITY_ONLY_HOST_CAN_CANCEL_ACTIVITY,
  CREATE_ACTIVITY_INVALID_INPUT, GET_ACTIVITIES_INVALID_PARAMS,
  GET_ACTIVITY_ACTIVITY_NOT_FOUND, GET_USER_ACTIVITIES_INVALID_PARAMS,
  JOIN_ACTIVITY_ACTIVITY_ALREADY_FULL,
  JOIN_ACTIVITY_ACTIVITY_ALREADY_STARTED,
  JOIN_ACTIVITY_ACTIVITY_NOT_AVAILABLE_TO_JOIN,
  JOIN_ACTIVITY_ACTIVITY_NOT_FOUND,
  JOIN_ACTIVITY_ACTIVITY_STATUS_DOES_NOT_ALLOW_JOIN,
  JOIN_ACTIVITY_USER_ALREADY_JOINED,
  LEAVE_ACTIVITY_ACTIVITY_ALREADY_CONFIRMED_TO_TAKE_PLACE,
  LEAVE_ACTIVITY_ACTIVITY_LEAVE_DEADLINE_ALREADY_PASSED,
  LEAVE_ACTIVITY_ACTIVITY_NOT_FOUND,
  LEAVE_ACTIVITY_ACTIVITY_STATUS_DOES_NOT_ALLOW_LEAVE,
  LEAVE_ACTIVITY_USER_IS_NOT_A_PARTICIPANT
} from '~/types/activity/ApiCodes'
import { GetActivityResponseDto, GetActivityResponseDtoSchema } from '~/types/activity/dto/GetActivityResponseDto'
import { AxiosRequestConfig } from 'axios'
import { EmptyResponseSchema } from '~/types/shared/dto/EmptyResponseDto'
import { GetActivitiesResponseDto, GetActivitiesResponseDtoSchema } from '~/types/activity/dto/GetActivitiesResponseDto'

export class ActivityService {
  private readonly protectedApiClient = new ApiClient(protectedClient)
  private readonly publicApiClient = new ApiClient(publicClient)

  public async getSports(): Promise<Result<GetSportsQueryResponseDto, AppServiceError>> {
    const result = await this.publicApiClient.get<GetSportsQueryResponseDto>(
      '/activities/sports',
      GetSportsQueryResponseDtoSchema,
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

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async createActivity(
    sportId: string,
    title: string,
    description: string | null,
    scheduledDate: string,
    config: {
      capabilities: Record<string, unknown>
      specs: Record<string, unknown>
    }
  ): Promise<Result<CreateActivityCommandResponseDto, AppServiceError>> {
    const result = await this.protectedApiClient.post<CreateActivityCommandResponseDto>(
      '/activities',
      CreateActivityCommandResponseSchema,
      ApiErrorResponseSchema,
      {
        sportId,
        title,
        description,
        scheduledDate,
        config,
      }
    )

    if (result.success) {
      return success(result.value)
    }

    const envelope = result.error

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope)

      return fail(AppServiceError.createNonUIError(envelope))
    }

    const errorResponse = envelope.response as ApiErrorResponseDto
    const errorCode = errorResponse.code

    if ('errors' in errorResponse && errorCode === CREATE_ACTIVITY_INVALID_INPUT) {
      const notificationError = errorResponse as NotificationErrorResponseDto
      const fields: Record<string, FieldErrorDetail> = {}

      notificationError.errors.forEach((errorItem) => {
        if (errorItem.field === 'scheduledDate' && errorItem.type === 'validation') {
          const translationKey = 'api-errors:create_activity_invalid_field_message_title'

          fields[errorItem.field] = {
            key: translationKey,
            type: 'validation',
          }
        }
      })

      if (Object.keys(fields).length > 0) {
        return fail(
          AppServiceError.createForm(
            'api-errors:create_activity_form_contains_errors_message_title',
            errorCode,
            fields,
            envelope
          )
        )
      }
    }

    const errorTranslations: Record<string, string> = {
      [UNAUTHORIZED_ACCESS]: 'api-errors:user_session_is_not_longer_valid_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async getActivity(activityId: string, config?: AxiosRequestConfig): Promise<Result<GetActivityResponseDto, AppServiceError>> {
    const result = await this.protectedApiClient.get<GetActivityResponseDto>(
      `/activities/${activityId}`,
      GetActivityResponseDtoSchema,
      StandardApiErrorResponseSchema,
      config
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
      [GET_ACTIVITY_ACTIVITY_NOT_FOUND]: 'api-errors:get_activity_activity_not_found_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async joinActivity(activityId: string): Promise<Result<void, AppServiceError>> {
    const result = await this.protectedApiClient.post<void>(
      `/activities/${activityId}/join`,
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
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [UNAUTHORIZED_ACCESS]: 'api-errors:user_session_is_not_longer_valid_message_title',
      [JOIN_ACTIVITY_ACTIVITY_NOT_FOUND]: 'api-errors:join_activity_activity_not_found_message_title',
      [JOIN_ACTIVITY_USER_ALREADY_JOINED]: 'api-errors:join_activity_user_already_joined_message_title',
      [JOIN_ACTIVITY_ACTIVITY_STATUS_DOES_NOT_ALLOW_JOIN]:
        'api-errors:join_activity_activity_does_not_allow_new_participants_message_title',
      [JOIN_ACTIVITY_ACTIVITY_ALREADY_FULL]: 'api-errors:join_activity_activity_already_full_message_title',
      [JOIN_ACTIVITY_ACTIVITY_ALREADY_STARTED]: 'api-errors:join_activity_activity_already_started_message_title',
      [JOIN_ACTIVITY_ACTIVITY_NOT_AVAILABLE_TO_JOIN]: 'api-errors:join_activity_activity_does_not_allow_new_participants_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async leaveActivity(activityId: string): Promise<Result<void, AppServiceError>> {
    const result = await this.protectedApiClient.post<void>(
      `/activities/${activityId}/leave`,
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
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [UNAUTHORIZED_ACCESS]: 'api-errors:user_session_is_not_longer_valid_message_title',
      [LEAVE_ACTIVITY_ACTIVITY_NOT_FOUND]: 'api-errors:leave_activity_activity_not_found_message_title',
      [LEAVE_ACTIVITY_USER_IS_NOT_A_PARTICIPANT]: 'api-errors:leave_activity_user_is_not_a_participant_message_title',
      [LEAVE_ACTIVITY_ACTIVITY_STATUS_DOES_NOT_ALLOW_LEAVE]: 'api-errors:leave_activity_activity_does_not_allow_leave_message_title',
      [LEAVE_ACTIVITY_ACTIVITY_LEAVE_DEADLINE_ALREADY_PASSED]: 'api-errors:leave_activity_activity_does_not_allow_leave_message_title',
      [LEAVE_ACTIVITY_ACTIVITY_ALREADY_CONFIRMED_TO_TAKE_PLACE]: 'api-errors:leave_activity_activity_already_confirmed_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async cancelActivity(activityId: string): Promise<Result<void, AppServiceError>> {
    const result = await this.protectedApiClient.post<void>(
      `/activities/${activityId}/cancel`,
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
    const errorCode = errorResponse.code

    const errorTranslations: Record<string, string> = {
      [UNAUTHORIZED_ACCESS]: 'api-errors:user_session_is_not_longer_valid_message_title',
      [CANCEL_ACTIVITY_ACTIVITY_NOT_FOUND]: 'api-errors:cancel_activity_activity_not_found_message_title',
      [CANCEL_ACTIVITY_ONLY_HOST_CAN_CANCEL_ACTIVITY]: 'api-errors:cancel_activity_only_host_can_cancel_message_title',
      [CANCEL_ACTIVITY_ACTIVITY_STATUS_DOES_NOT_ALLOW_CANCEL]:
        'api-errors:cancel_activity_activity_does_not_allow_cancel_message_title',
      [CANCEL_ACTIVITY_ACTIVITY_WITH_PARTICIPANTS_CANNOT_BE_CANCELLED]:
        'api-errors:cancel_activity_activity_with_participants_cannot_be_cancelled_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async getActivities(
    filters: Record<string, string | Array<string>>,
    config?: AxiosRequestConfig
  ): Promise<Result<GetActivitiesResponseDto, AppServiceError>> {
    const searchParams = new URLSearchParams()

    Object.entries(filters).map(([key, value]) => {
      if (Array.isArray(value)) {
        const concatenatedValue = value.join(',')

        searchParams.append(key, concatenatedValue)
      } else {
        searchParams.append(key, value)
      }
    })

    const result = await this.protectedApiClient.get<GetActivitiesResponseDto>(
      `/activities?${searchParams.toString()}`,
      GetActivitiesResponseDtoSchema,
      StandardApiErrorResponseSchema,
      config
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
      [GET_ACTIVITIES_INVALID_PARAMS]: 'api-errors:get_activities_invalid_params_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }

  public async getUserActivities(
    filters: Record<string, string | Array<string>>,
    config?: AxiosRequestConfig
  ): Promise<Result<GetActivitiesResponseDto, AppServiceError>> {
    const searchParams = new URLSearchParams()

    Object.entries(filters).map(([key, value]) => {
      if (Array.isArray(value)) {
        const concatenatedValue = value.join(',')

        searchParams.append(key, concatenatedValue)
      } else {
        searchParams.append(key, value)
      }
    })

    const result = await this.protectedApiClient.get<GetActivitiesResponseDto>(
      `/activities/history?${searchParams.toString()}`,
      GetActivitiesResponseDtoSchema,
      StandardApiErrorResponseSchema,
      config
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
      [GET_USER_ACTIVITIES_INVALID_PARAMS]: 'api-errors:get_activities_invalid_params_message_title',
    }

    const translationKey = errorTranslations[errorCode]

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope))
    }

    reportApiErrorToSentry(envelope)

    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    )
  }
}
