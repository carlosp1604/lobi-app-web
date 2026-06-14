import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Button } from '~/components/ui/button'
import { Result } from '~/types/Result'
import { useAuth } from '~/hooks/useAuth'
import { useState } from 'react'
import { AppServiceError } from '~/types/AppServiceError'
import { VerifyEmailForm } from '~/components/Forms/VerifyEmailForm'
import { ResetPasswordForm } from '~/components/Forms/ResetPasswordForm'
import { ValidateTokenForm } from '~/components/Forms/ValidateTokenForm'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { InformationModalProvider } from '~/context/InformationModalProvider'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import {
  AUTH_RESET_PASSWORD_INVALID_TOKEN,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_EXPIRED,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED
} from '~/types/auth/ApiCodes'

type ResetPasswordStep = 'verify-email' | 'validate-token' | 'reset' | 'confirm'

interface StepData {
  step: number
  descriptionKey: string
  previous: ResetPasswordStep | null
  next: ResetPasswordStep | null
}

const TotalSteps = 3
const ResetPasswordStepData : Record<Extract<ResetPasswordStep, 'verify-email' | 'validate-token' | 'reset'>, StepData> = {
  'verify-email': {
    step: 1,
    descriptionKey: 'reset_password_verify_email_step_description',
    previous: null,
    next: 'validate-token',
  },
  'validate-token': {
    step: 2,
    descriptionKey: 'reset_password_validate_token_step_description',
    previous: 'verify-email',
    next: 'reset',
  },
  'reset': {
    step: 3,
    descriptionKey: 'reset_password_reset_password_step_description',
    previous: 'validate-token',
    next: null,
  },
}

export function ResetPassword() {
  const { t } = useTranslation('auth')

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<ResetPasswordStep>('verify-email')
  const [email, setEmail] = useState<string>('')
  const [verificationToken, setVerificationToken] = useState<string>('')

  const { status, user, setLoginOpen } = useAuth()
  const isAuthenticated = status === 'authenticated' && user

  const onSendEmailComplete = (result: Result<string, AppServiceError>): void => {
    if (result.success) {
      setEmail(result.value)
      setStep('validate-token')

    }
  }

  const onAlreadyHasCode = (email: string) => {
    setEmail(email)
    setStep('validate-token')
  }

  const onTokenValidationComplete = (result: Result<string, AppServiceError>): void => {
    if (result.success) {
      setVerificationToken(result.value)
      setStep('reset')

      return
    }

    /**
    const invalidTokenErrors = [
      AUTH_VALIDATE_TOKEN_ALREADY_USED,
      AUTH_VALIDATE_TOKEN_ALREADY_EXPIRED,
      AUTH_VALIDATE_TOKEN_INVALID_TOKEN
    ]

    const error = result.error

    if (invalidTokenErrors.includes(error.apiCode)) {
      setVerificationToken('')
      setEmail('')
      setStep('verify-email')
    }
    */
  }

  const onResetPasswordComplete = (result: Result<void, AppServiceError>): void => {
    if (result.success) {
      setEmail('')
      setVerificationToken('')
      setStep('confirm')

      return
    }

    const error = result.error

    const fatalTokenErrors = [
      AUTH_RESET_PASSWORD_TOKEN_ALREADY_EXPIRED,
      AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED,
      AUTH_RESET_PASSWORD_INVALID_TOKEN,
    ]

    if (error.isApiErrorType(fatalTokenErrors)) {
      setEmail('')
      setVerificationToken('')
      setStep('verify-email')
    }
  }

  let content = null

  if (step === 'verify-email') {
    content = (
      <VerifyEmailForm
        mode="reset"
        loading={ loading }
        onLoadingChange={ (loading) => setLoading(loading) }
        onActionComplete={ onSendEmailComplete }
        onAlreadyHasCode={ onAlreadyHasCode }
      />
    )
  }

  if (step === 'validate-token') {
    content = (
      <ValidateTokenForm
        mode="reset"
        email={ email }
        onLoadingChange={ (loading) => setLoading(loading) }
        loading={ loading }
        onActionComplete={ onTokenValidationComplete }
      />
    )
  }

  if (step === 'reset') {
    content = (
      <ResetPasswordForm
        email={ email }
        verificationToken={ verificationToken }
        loading={ loading }
        onLoadingChange={ (loading) => setLoading(loading) }
        onActionComplete={ onResetPasswordComplete }
      />
    )
  }

  if (step === 'confirm') {
    return (
      <div className="flex flex-col">
        <div className="mx-auto w-full max-w-md pt-10 px-4">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full w-fit">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>
                { t('reset_password_confirm_step_title') }
              </CardTitle>
              <CardDescription className="mt-2">
                { t('reset_password_confirm_step_description') }
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 pt-2">
              <Button className="w-full" asChild>
                <Link href="/">
                  { t('reset_password_confirm_step_home_button_title') }
                </Link>
              </Button>
              {
                isAuthenticated ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={ `/users/${user.username}/` }>
                      { t('reset_password_confirm_step_profile_button_title') }
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={ () => setLoginOpen(true) }>
                    { t('reset_password_confirm_step_login_button_title') }
                  </Button>
                )
              }
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-md pt-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-x-2 min-h-[40px]">
              { step !== 'verify-email' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors -ml-2"
                  onClick={ () => {
                    const prev = ResetPasswordStepData[step].previous

                    if (prev) {
                      setStep(prev)
                    }
                  } }
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) }
              <span>{ t('reset_password_header_title') }</span>
            </CardTitle>

            <CardDescription className="whitespace-pre-line">
              { t(ResetPasswordStepData[step].descriptionKey) }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InformationModalProvider>
              { content }
            </InformationModalProvider>

          </CardContent>
          <CardFooter className="flex justify-end py-2 px-6 border-t bg-muted/30 rounded-b-lg">
            <span className="text-xs text-muted-foreground font-medium">
              { t('reset_password_step_n_of_total_title', {
                step: ResetPasswordStepData[step].step,
                totalSteps: TotalSteps,
              }) }
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
