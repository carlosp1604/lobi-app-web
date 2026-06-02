import * as z from 'zod';
import useTranslation from "next-translate/useTranslation";
import { Button } from '~/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FieldGroup } from '~/components/ui/field';
import { EmailInput } from "~/components/Forms/Input/EmailInput";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AUTH_VERIFY_EMAIL_EMAIL_ALREADY_TAKEN, AUTH_VERIFY_EMAIL_TOKEN_ALREADY_ISSUED } from "~/types/auth/ApiCodes";
import { AuthService } from "~/services/auth/AuthService";
import { toast } from "sonner";
import {Result, success} from "~/types/Result";
import {AppServiceError} from "~/types/AppServiceError";

interface VerifyEmailFormProps {
  mode: 'signup' | 'reset';
  loading: boolean;
  onLoadingChange: (loading: boolean) => void;
  onActionComplete?: (result: Result<string, AppServiceError>) => void;
  onAlreadyHasCode: (email: string) => void;
}

export function VerifyEmailForm({mode, loading, onLoadingChange, onActionComplete, onAlreadyHasCode }: VerifyEmailFormProps) {
  const { t } = useTranslation('auth');

  const [showResend, setShowResend] = useState(false);

  const verifyEmailSchema = z.object({
    email: z.email({ message: t('email_input_error_message') }),
  });

  type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const { isValid } = form.formState;

  const emailValue = form.watch('email');

  useEffect(() => {
    if (showResend) {
      setShowResend(false);
    }
  }, [emailValue]);

  async function onSubmit(data: VerifyEmailFormValues, isResendAction = false) {
    onLoadingChange(true);

    const authService = new AuthService();
    let result

    const shouldForceResend = isResendAction || showResend;

    if (mode === 'signup') {
      result = await authService.verifyEmailSignup(data.email, shouldForceResend);
    } else {
      result = await authService.verifyEmailReset(data.email, shouldForceResend);
    }

    onLoadingChange(false);

    if (!result.success) {
      const error = result.error;

      if (error.isApiErrorType(AUTH_VERIFY_EMAIL_TOKEN_ALREADY_ISSUED)) {
        form.setError('email', {type: 'server', message: t(error.getTranslationKey())});
        setShowResend(true);

        toast.warning(t(error.getTranslationKey()));
      } else if (error.isApiErrorType(AUTH_VERIFY_EMAIL_EMAIL_ALREADY_TAKEN)) {
        form.setError('email', {type: 'server', message: t(error.getTranslationKey())});
        toast.warning(t(error.getTranslationKey()));
      } else {
        toast.error(t(error.getTranslationKey()));
      }

      if (onActionComplete) {
        onActionComplete(result);
      }
      return;
    } else {
      if (shouldForceResend) {
        toast.success(t('verify_email_token_resent_success_title'));
      }
    }

    if (onActionComplete) {
      onActionComplete(success(data.email));
    }
  }

  return (
    <form
      id="verify-email-form"
      onSubmit={form.handleSubmit((data) => onSubmit(data, false))}
      className="space-y-2"
    >
      <FieldGroup className="flex flex-col">
        <Controller
          name="email"
          control={form.control}
          render={({field, fieldState}) => (
            <EmailInput
              label={t('email_label_title')}
              placeholder={t('email_input_placeholder')}
              field={field}
              fieldState={fieldState}
              disabled={loading}
            />
          )}
        />
      </FieldGroup>
      <div className="flex flex-col gap-y-1 w-full">
        <Button
          variant="link"
          type="button"
          size="icon-xs"
          disabled={!showResend || loading}
          className={`w-full text-center cursor-pointer transition-all duration-200 ${
            showResend
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
        >
          {t('verify_email_resend_token_button_title')}
        </Button>
        <Button
          type="submit"
          form="verify-email-form"
          className="w-full cursor-pointer"
          disabled={showResend || loading || !isValid}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          {!loading && t('verify_email_submit_button_title')}
        </Button>
        <Button
          variant="link"
          type="button"
          disabled={(!isValid || loading) && !showResend}
          className="w-full text-center cursor-pointer"
          onClick={() => onAlreadyHasCode(form.getValues('email'))}
        >
          {t('verify_email_already_has_token_title')}
        </Button>
      </div>
    </form>
  );
}
