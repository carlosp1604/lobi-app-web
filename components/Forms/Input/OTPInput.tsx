import {InputOTP, InputOTPGroup, InputOTPSlot} from "~/components/ui/input-otp";
import {REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp";
import {useState} from "react";
import {ControllerFieldState, ControllerRenderProps} from "react-hook-form";
import {Field, FieldError, FieldLabel} from "~/components/ui/field";

const ValidPatterns = [REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS] as const
type ValidPattern = (typeof ValidPatterns)[number]

interface OTPInputFieldProps {
  label: string;
  length: number;
  pattern?: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  fieldState: ControllerFieldState;
}

export function OTPInput({
  label,
  length,
  pattern,
  disabled,
  field,
  fieldState,
}: OTPInputFieldProps) {
  if (length < 1 || length > 16) {
    return null
  }

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>
        {label}
      </FieldLabel>
      <InputOTP
        id={field.name}
        maxLength={length}
        pattern={pattern}
        disabled={disabled}
        value={field.value}
        onChange={field.onChange}
      >
        <InputOTPGroup>
          {Array.from(Array(length).keys()).map((index) => (
            <InputOTPSlot
              index={index}
              key={index}
              aria-invalid={fieldState.invalid}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <div className="h-5 -mt-0.5">
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]}/>
        )}
      </div>
    </Field>
  );
}
