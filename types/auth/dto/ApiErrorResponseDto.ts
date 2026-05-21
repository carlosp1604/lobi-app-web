export interface StandardApiErrorResponseDto {
  code: string;
  message: string;
}


export type SignupApiErrorResponseDto = StandardApiErrorResponseDto |
  {
    message: string;
    errors: StandardApiErrorResponseDto
  }
