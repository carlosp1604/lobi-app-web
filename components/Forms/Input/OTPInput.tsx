import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui/input-otp'
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form'

interface OTPInputFieldProps {
  label: string
  length: number
  pattern?: string
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export const OTPInput = ({
  label,
  length,
  pattern,
  disabled,
  field,
  fieldState,
}: OTPInputFieldProps) => {
  if (length < 1 || length > 16) {
    return null
  }

  return (
    <Field data-invalid={ fieldState.invalid }>
      <FieldLabel htmlFor={ field.name }>
        { label }
      </FieldLabel>
      <InputOTP
        id={ field.name }
        maxLength={ length }
        pattern={ pattern }
        disabled={ disabled }
        value={ field.value }
        onChange={ field.onChange }
      >
        <InputOTPGroup>
          { Array.from(Array(length).keys()).map((index) => (
            <InputOTPSlot
              index={ index }
              key={ index }
              aria-invalid={ fieldState.invalid }
            />
          )) }
        </InputOTPGroup>
      </InputOTP>
      <div className="h-5 -mt-0.5">
        { fieldState.invalid && (
          <FieldError errors={ [fieldState.error] }/>
        ) }
      </div>
    </Field>
  )
}
