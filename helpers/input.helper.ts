/** Auth **/
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const PasswordRegex = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`
);

export const VerificationTokenLength = 8;

export const UsernameRegex = new RegExp(/^(?=.{6,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
export const UserNameRegex = new RegExp(/^[\p{L} \-']{2,255}$/u);


/** Activities **/
export const MIN_ACTIVITY_DESCRIPTION_LENGTH = 1;
export const MAX_ACTIVITY_DESCRIPTION_LENGTH = 2000;
export const MIN_ACTIVITY_TITLE_LENGTH = 4;
export const MAX_ACTIVITY_TITLE_LENGTH = 100;

export const ActivityTitleForbiddenRegex = new RegExp(/\p{Cc}/u)
export const ActivityDescriptionRegex = new RegExp(`^[\\s\\S]{${MIN_ACTIVITY_DESCRIPTION_LENGTH},${MAX_ACTIVITY_DESCRIPTION_LENGTH}}$`)

export const MIN_MARGIN_MINUTES = 90
export const MAX_FUTURE_DAYS = 7
