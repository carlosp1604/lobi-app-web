const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const PasswordRegex = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`
);

export const VerificationTokenLength = 8;


export const UsernameRegex = new RegExp(/^(?=.{6,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
export const UserNameRegex = new RegExp(/^[\p{L} \-']{2,255}$/u);
