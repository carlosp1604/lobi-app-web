import {useState} from "react";
import {VerifyEmailForm} from "~/components/Forms/VerifyEmailForm";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {ValidateTokenForm} from "~/components/Forms/ValidateTokenForm";
import useTranslation from "next-translate/useTranslation";
import {Button} from "~/components/ui/button";
import {ArrowLeft, CheckCircle2} from "lucide-react";
import {Result} from "~/types/Result";
import {
  AUTH_CREATE_USER_INVALID_TOKEN,
  AUTH_CREATE_USER_TOKEN_ALREADY_EXPIRED,
  AUTH_CREATE_USER_TOKEN_ALREADY_USED,
} from "~/types/auth/ApiCodes";
import {ServiceError, ServiceErrorLegacy} from "~/types/ServiceError";
import SignupForm from "~/components/Forms/SignupForm";

type SignupStep = 'verify-email' | 'validate-token' | 'signup' | 'confirm'

type StepData = {
  step: number
  descriptionKey: string
  previous: SignupStep | null
  next: SignupStep | null
}

const TotalSteps = 3
const ResetPasswordStepData : Record<Extract<SignupStep, 'verify-email' | 'validate-token' | 'signup'>, StepData> = {
  'verify-email': {
    step: 1,
    descriptionKey: 'signup_verify_email_step_description',
    previous: null,
    next: 'validate-token'
  },
  'validate-token': {
    step: 2,
    descriptionKey: 'signup_validate_token_step_description',
    previous: 'verify-email',
    next: 'signup'
  },
  'signup': {
    step: 3,
    descriptionKey: 'signup_signup_step_description',
    previous: 'validate-token',
    next: null,
  }
}

export function Signup() {
  const { t } = useTranslation('auth');

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<SignupStep>('verify-email')
  const [email, setEmail] = useState<string>('')
  const [verificationToken, setVerificationToken] = useState<string>('')

  const onSendEmailComplete = (result: Result<string, ServiceError>): void => {
    if (result.success) {
      setEmail(result.value);
      setStep('validate-token');
    }
  }

  const onAlreadyHasCode = (email: string) => {
    setEmail(email)
    setStep('validate-token')
  }

  const onTokenValidationComplete = (result: Result<string, ServiceError>): void => {
    if (result.success) {
      setVerificationToken(result.value)
      setStep('signup')

      return;
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

  const onSignupComplete = (result: Result<void, ServiceErrorLegacy>): void => {
    if (result.success) {
      setEmail('')
      setVerificationToken('')
      setStep('confirm')
      return;
    }

    const error = result.error

    const fatalTokenErrors = [
      AUTH_CREATE_USER_TOKEN_ALREADY_EXPIRED,
      AUTH_CREATE_USER_TOKEN_ALREADY_USED,
      AUTH_CREATE_USER_INVALID_TOKEN,
    ];

    if ('apiCode' in error && fatalTokenErrors.includes(error.apiCode)) {
      setEmail('');
      setVerificationToken('');
      setStep('verify-email');
    }
  }

  let content = null

  if (step === 'verify-email') {
    content = (
      <VerifyEmailForm
        mode="signup"
        loading={loading}
        onLoadingChange={(loading) => setLoading(loading)}
        onActionComplete={onSendEmailComplete}
        onAlreadyHasCode={onAlreadyHasCode}
      />
    )
  }

  if (step === 'validate-token') {
    content = (
      <ValidateTokenForm
        mode="signup"
        email={email}
        onLoadingChange={(loading) => setLoading(loading)}
        loading={loading}
        onActionComplete={onTokenValidationComplete}
      />
    )
  }

  if (step === 'signup') {
    content = (
      <SignupForm
        email={email}
        verificationToken={verificationToken}
        loading={loading}
        onLoadingChange={(loading) => setLoading(loading)}
        onActionComplete={onSignupComplete}
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
                {t('signup_confirm_step_title')}
              </CardTitle>
              <CardDescription className="mt-2">
                {t('signup_confirm_step_description')}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2 pt-2">
              <Button
                className="w-full cursor-pointer"
                onClick={() => window.location.href = '/auth/login'}
              >
                {t('signup_confirm_step_login_button_title')}
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => window.location.href = '/'}
              >
                {t('signup_confirm_step_home_button_title')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-md pt-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-x-2 min-h-[40px]">
              {step !== 'verify-email' && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors cursor-pointer -ml-2" // 🌟 '-ml-2' compensa el padding para que la flecha se alinee al borde izquierdo
                  onClick={() => {
                    const prev = ResetPasswordStepData[step].previous;
                    if (prev) {
                      setStep(prev);
                    }
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <span>{t('signup_header_title')}</span>
            </CardTitle>
            <CardDescription className="whitespace-pre-line">
              {t(ResetPasswordStepData[step].descriptionKey)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {content}
          </CardContent>
          <CardFooter className="flex justify-end py-2 px-6 border-t bg-muted/30 rounded-b-lg">
          <span className="text-xs text-muted-foreground font-medium">
            {t('signup_password_step_n_of_total_title', {
              step: ResetPasswordStepData[step].step,
              totalSteps: TotalSteps
            })}
          </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
