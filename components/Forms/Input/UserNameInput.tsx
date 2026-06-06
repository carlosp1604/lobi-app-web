import { Input } from '~/components/ui/input'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { ControllerFieldState, ControllerRenderProps, FieldValue } from 'react-hook-form'

interface UserNameInputFieldProps {
  label: string
  placeholder: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<FieldValue<any>>
  fieldState: ControllerFieldState
  disabled?: boolean
}

export const UserNameInput = ({
  label,
  placeholder,
  field,
  fieldState,
  disabled,
}: UserNameInputFieldProps) => {
  return (
    <Field data-invalid={ fieldState.invalid }>
      <FieldLabel htmlFor={ field.name }>
        { label }
      </FieldLabel>
      <Input
        { ...field }
        id={ field.name }
        type="text"
        aria-invalid={ fieldState.invalid }
        placeholder={ placeholder }
        autoComplete="name"
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
