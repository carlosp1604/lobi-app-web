import { fail, Result, success } from "~/types/Result";
import { protectedClient } from "~/helpers/api.helper";
import { AppServiceError } from "~/types/ServiceError";
import { ApiClient } from "~/helpers/ApiClient";
import { reportApiErrorToSentry } from "~/helpers/sentry.helper";
import {
  GetUserProfileByUsernameResponseDto,
  GetUserProfileByUsernameResponseSchema
} from "~/types/users/dto/GetUserProfileByUsernameResponseDto";
import {
  GET_USER_PROFILE_BY_USERNAME_INVALID_USERNAME,
  GET_USER_PROFILE_BY_USERNAME_USER_NOT_FOUND
} from "~/types/users/ApiCodes";
import {
  StandardApiErrorResponseDto,
  StandardApiErrorResponseSchema
} from "~/types/shared/dto/StandardApiErrorResponseDto";

export class UserService {
  /** Protected client | with credentials **/
  private readonly protectedApiClient = new ApiClient(protectedClient);

  public async getUserProfile(
    username: string
  ): Promise<Result<GetUserProfileByUsernameResponseDto, AppServiceError>> {
    const result = await this.protectedApiClient.get<GetUserProfileByUsernameResponseDto>(
      `/users/profile/${username}`,
      GetUserProfileByUsernameResponseSchema,
      StandardApiErrorResponseSchema
    );

    if (result.success) {
      return success(result.value);
    }

    const envelope = result.error;

    if (envelope.type === 'network' || envelope.type === 'validation') {
      reportApiErrorToSentry(envelope);
      return fail(AppServiceError.createNonUIError(envelope));
    }

    const errorResponse = envelope.response as StandardApiErrorResponseDto;
    const errorCode = errorResponse.code;

    const errorTranslations: Record<string, string> = {
      [GET_USER_PROFILE_BY_USERNAME_USER_NOT_FOUND]: 'api-errors:user_profile_not_found_message_title',
      [GET_USER_PROFILE_BY_USERNAME_INVALID_USERNAME]: 'api-errors:user_username_is_not_valid_message_title',
    };

    const translationKey = errorTranslations[errorCode];

    if (translationKey) {
      return fail(AppServiceError.createStandard(translationKey, errorCode, envelope));
    }

    reportApiErrorToSentry(envelope);
    return fail(
      AppServiceError.createStandard(
        'api-errors:unexpected_server_error_message_title',
        errorCode,
        envelope
      )
    );
  }
}
