'use client'

import useTranslation from 'next-translate/useTranslation'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldGroup } from '~/components/ui/field'
import { Button } from '~/components/ui/button'
import { Loader2 } from 'lucide-react'
import { PasswordInputField } from '~/components/Forms/Input/PasswordInput'
import { PasswordRegex, UserNameRegex, UsernameRegex } from '~/helpers/input.helper'
import { Result } from '~/types/Result'
import { AuthService } from '~/services/auth/AuthService'
import { toast } from 'sonner'
import { UserNameInput } from '~/components/Forms/Input/UserNameInput'
import { UserUsernameInput } from '~/components/Forms/Input/UserUsernameInput'
import { UserRole } from '~/types/users/UserRole'
import { AppServiceError } from '~/types/AppServiceError'

interface SignupFormProps {
  email: string
  verificationToken: string
  loading: boolean
  onLoadingChange: (loading: boolean) => void
  onActionComplete?: (result: Result<void, AppServiceError>) => void
}

export const SignupForm = ({
  email,
  verificationToken,
  loading,
  onLoadingChange,
  onActionComplete,
}: SignupFormProps) =>  {
  const { t } = useTranslation('auth')
  const signupSchema = z.object({
    username: z.string().refine((value) => UsernameRegex.test(value), { message: t('username_input_error_message') }),
    name: z.string().refine((value) => UserNameRegex.test(value), { message: t('user_name_input_error_message') }),
    password: z
      .string()
      .refine((val) => PasswordRegex.test(val), {
        message: t('password_input_error_message'),
      }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('confirm_password_input_error_message'),
    path: ['confirmPassword'],
  })

  type SignupFormValues = z.infer<typeof signupSchema>

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { password: '', confirmPassword: '', name: '', username: '' },
    mode: 'onChange',
  })

  const { isValid, errors } = form.formState

  const passwordValue = form.watch('password')

  const isConfirmEnabled = passwordValue.length > 0 && !errors.password

  async function onSubmit(data: SignupFormValues) {
    onLoadingChange(true)

    const authService = new AuthService()
    const result = await authService.signup(
      email,
      data.name,
      data.username,
      verificationToken,
      data.password,
      UserRole.SPORTSMAN
    )

    onLoadingChange(false)

    if (!result.success) {
      const error = result.error

      if (error.isStandard()) {
        toast.error(t(error.getTranslationKey()))
      } else {
        if (error.hasConflictError('username')) {
          form.setError('username', { type: 'server', message: t('username_already_in_used_error_message') })
        }
      }

      if (onActionComplete) {
        onActionComplete(result)
      }

      return
    }

    if (onActionComplete) {
      onActionComplete(result)
    }
  }

  return (
    <form
      id="reset-password-form"
      onSubmit={ form.handleSubmit(onSubmit) }
      className="space-y-4"
    >
      <FieldGroup className="flex flex-col gap-3">
        <Controller
          name="name"
          control={ form.control }
          render={ ({ field, fieldState }) => (
            <UserNameInput
              label={ t('user_name_label_title') }
              placeholder={ t('user_name_input_placeholder') }
              field={ field }
              fieldState={ fieldState }
              disabled={ loading }
            />
          ) }
        />
        <Controller
          name="username"
          control={ form.control }
          render={ ({ field, fieldState }) => (
            <UserUsernameInput
              label={ t('username_label_title') }
              placeholder={ t('username_input_placeholder') }
              field={ field }
              fieldState={ fieldState }
              disabled={ loading }
              help={ {
                helpButtonTitle: t('username_help_button_title'),
                title: t('username_help_title'),
                description: t('username_help_description'),
              } }
            />
          ) }
        />
        <Controller
          name="password"
          control={ form.control }
          render={ ({ field, fieldState }) => (
            <PasswordInputField
              label={ t('password_label_title') }
              placeholder={ t('password_input_placeholder') }
              help={ {
                helpButtonTitle: t('password_help_button_title'),
                title: t('password_help_title'),
                description: t('password_help_description'),
                showPasswordTitle: t('password_show_password_button_title'),
                hidePasswordTitle: t('password_hide_password_button_title'),
              } }
              field={ field }
              fieldState={ fieldState }
              disabled={ loading }
            />
          ) }
        />
        <Controller
          name="confirmPassword"
          control={ form.control }
          render={ ({ field, fieldState }) => (
            <PasswordInputField
              label={ t('confirm_password_label_title') }
              placeholder={ t('confirm_password_input_placeholder') }
              field={ field }
              fieldState={ fieldState }
              disabled={ loading || !isConfirmEnabled }
            />
          ) }
        />
      </FieldGroup>
      <div className="w-full">
        <Button
          type="submit"
          form="reset-password-form"
          className="w-full"
          disabled={ loading || !isValid }
        >
          { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/> }
          { !loading && t('signup_submit_button_title') }
        </Button>
      </div>
    </form>
  )
}
