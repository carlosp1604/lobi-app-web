'use client'

import * as z from 'zod'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Result } from '~/types/Result'
import { Loader2 } from 'lucide-react'
import { FieldGroup } from '~/components/ui/field'
import { AuthService } from '~/services/auth/AuthService'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordRegex } from '~/helpers/input.helper'
import { AppServiceError } from '~/types/AppServiceError'
import { PasswordInputField } from '~/components/Forms/Input/PasswordInput'
import { Controller, useForm } from 'react-hook-form'
import {
  AUTH_RESET_PASSWORD_SAME_PASSWORD
} from '~/types/auth/ApiCodes'

interface ResetPasswordFormProps {
  email: string
  verificationToken: string
  loading: boolean
  onLoadingChange: (loading: boolean) => void
  onActionComplete?: (result: Result<void, AppServiceError>) => void
}

export const ResetPasswordForm = ({
  email,
  verificationToken,
  loading,
  onLoadingChange,
  onActionComplete,
}: ResetPasswordFormProps) => {
  const { t } = useTranslation('auth')
  const resetPasswordSchema = z.object({
    password: z
      .string()
      .refine((value) => PasswordRegex.test(value), {
        message: t('password_input_error_message'),
      }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('confirm_password_input_error_message'),
    path: ['confirmPassword'],
  })

  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const { isValid, errors } = form.formState

  const passwordValue = form.watch('password')

  const isConfirmEnabled = passwordValue.length > 0 && !errors.password

  async function onSubmit(data: ResetPasswordFormValues) {
    onLoadingChange(true)

    const authService = new AuthService()
    const result = await authService.resetPassword(
      email,
      verificationToken,
      data.password
    )

    onLoadingChange(false)

    if (!result.success) {
      const error = result.error

      toast.error(t(error.getTranslationKey()))

      if (error.isApiErrorType(AUTH_RESET_PASSWORD_SAME_PASSWORD)) {
        form.setError('password', { type: 'server', message: t(error.getTranslationKey()) })
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
          { !loading && t('reset_password_submit_button_title') }
        </Button>
      </div>
    </form>
  )
}
