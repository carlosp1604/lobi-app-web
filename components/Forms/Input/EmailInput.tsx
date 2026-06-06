import { ControllerFieldState, ControllerRenderProps, FieldValue } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

interface EmailInputFieldProps {
  label: string
  placeholder: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<FieldValue<any>>
  fieldState: ControllerFieldState
  disabled?: boolean
}

export const EmailInput = ({ label, placeholder, field, fieldState, disabled }: EmailInputFieldProps) => {
  return (
    <Field data-invalid={ fieldState.invalid }>
      <FieldLabel htmlFor={ field.name }>
        { label }
      </FieldLabel>
      <Input
        { ...field }
        id={ field.name }
        type="email"
        aria-invalid={ fieldState.invalid }
        placeholder={ placeholder }
        autoComplete="email"
        disabled={ disabled }
      />
      <div className="h-4 -mt-0.5">
        { fieldState.invalid && (
          <FieldError errors={ [fieldState.error] }/>
        ) }
      </div>
    </Field>
  )
}
