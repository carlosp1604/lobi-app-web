'use client'

import { useState } from 'react'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { Field,FieldError, FieldLabel } from '~/components/ui/field'
import { ControllerFieldState, ControllerRenderProps, FieldValue } from 'react-hook-form'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '~/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '~/components/ui/popover'

interface PasswordInputHelpProps {
  helpButtonTitle: string
  title: string
  description: string
  showPasswordTitle: string
  hidePasswordTitle: string
}

interface PasswordInputFieldProps {
  label: string
  placeholder: string
  help?: PasswordInputHelpProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<FieldValue<any>>
  fieldState: ControllerFieldState
  disabled?: boolean
}

export const PasswordInputField = ({
  label,
  placeholder,
  help,
  field,
  fieldState,
  disabled,
}: PasswordInputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field data-invalid={ fieldState.invalid }>
      <FieldLabel htmlFor={ field.name } className="mb-0">
        { label }
      </FieldLabel>

      <InputGroup>
        <InputGroupInput
          { ...field }
          id={ field.name }
          type={ showPassword ? 'text' : 'password' }
          aria-invalid={ fieldState.invalid }
          placeholder={ placeholder }
          autoComplete="off"
          disabled={ disabled }
        />
        {
          help && (
            <InputGroupAddon align="inline-end">
              <Popover>
                <PopoverTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    size="icon-sm"
                    disabled={ disabled }
                    aria-label={ help.helpButtonTitle }
                    type="button"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </InputGroupButton>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="top"
                  className="w-64 p-3 text-xs bg-popover text-popover-foreground border shadow-md rounded-md whitespace-pre-line"
                >
                  <PopoverHeader>
                    <PopoverTitle>{ help.title }</PopoverTitle>
                    <PopoverDescription>{ help.description }</PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
              <InputGroupButton
                variant="ghost"
                size="icon-sm"
                disabled={ disabled }
                onClick={ () => setShowPassword((prev) => !prev) }
                aria-label={ showPassword ? help.hidePasswordTitle : help.showPasswordTitle }
              >
                { showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                ) }
              </InputGroupButton>
            </InputGroupAddon>
          )
        }
      </InputGroup>
      <div className="h-5 -mt-0.5">
        { fieldState.invalid && (
          <FieldError errors={ [fieldState.error] } />
        ) }
      </div>
    </Field>
  )
}
