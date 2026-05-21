import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {OTPInput} from "~/components/Forms/Input/OTPInput";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import {Button} from "~/components/ui/button";
import {Loader2} from "lucide-react";
import {FieldGroup} from "~/components/ui/field";
import {VerificationTokenLength} from "~/helpers/input.helper";
import useTranslation from "next-translate/useTranslation";
import {Result, success} from "~/types/Result";
import {ServiceError} from "~/types/ServiceError";
import {AuthService} from "~/services/auth/AuthService";
import {VerificationTokenPurpose} from "~/types/auth/VerificationTokenPurpose";
import {
  AUTH_CREATE_USER_INVALID_TOKEN,
  AUTH_CREATE_USER_TOKEN_ALREADY_EXPIRED,
  AUTH_CREATE_USER_TOKEN_ALREADY_USED,
  AUTH_RESET_PASSWORD_INVALID_TOKEN,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_EXPIRED,
  AUTH_RESET_PASSWORD_TOKEN_ALREADY_USED,
  AUTH_VALIDATE_TOKEN_ALREADY_EXPIRED,
  AUTH_VALIDATE_TOKEN_ALREADY_USED,
  AUTH_VALIDATE_TOKEN_INVALID_TOKEN
} from "~/types/auth/ApiCodes";
import {toast} from "sonner";

interface ValidateTokenFormProps {
  mode: 'signup' | 'reset';
  loading: boolean;
  email: string;
  onLoadingChange: (loading: boolean) => void;
  onActionComplete?: (result: Result<string, ServiceError>) => void;
}

export function ValidateTokenForm({ mode, loading, email, onLoadingChange, onActionComplete}: ValidateTokenFormProps) {
  const { t } = useTranslation('auth');

  const tokenSchema = z.object({
    token: z.string().min(VerificationTokenLength, { message: t('token_input_error_message', {length: VerificationTokenLength}) }),
  });

  type ValidateTokenFormValues = z.infer<typeof tokenSchema>;

  const form = useForm({
    resolver: zodResolver(tokenSchema),
    defaultValues: { token: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: ValidateTokenFormValues) {
    onLoadingChange(true);

    const authService = new AuthService();
    const result = await authService.validateToken(
      email,
      mode === 'signup' ? VerificationTokenPurpose.CREATE_ACCOUNT : VerificationTokenPurpose.RESET_PASSWORD,
      data.token,
    );

    onLoadingChange(false);

    const invalidTokenErrors = [
      AUTH_VALIDATE_TOKEN_ALREADY_USED,
      AUTH_VALIDATE_TOKEN_ALREADY_EXPIRED,
      AUTH_VALIDATE_TOKEN_INVALID_TOKEN
    ]

    if (!result.success) {
      const error = result.error
      toast.error(t(error.key));

      if (invalidTokenErrors.includes(error.apiCode)) {
        form.setError('token', { type: 'server', message: t(error.key) });
      }

      if (onActionComplete) {
        onActionComplete(result);
      }
      return;
    }

    if (onActionComplete) {
      onActionComplete(success(data.token));
    }
  }

  const { isValid } = form.formState;

  return (
    <form
      id="validate-token-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4">
      <FieldGroup>
        <Controller
          name="token"
          control={form.control}
          render={({field, fieldState}) => (
            <OTPInput
              label={t('token_label_title')}
              length={VerificationTokenLength}
              pattern={REGEXP_ONLY_DIGITS}
              field={field}
              fieldState={fieldState}
              disabled={loading}
            />
          )}
        />
      </FieldGroup>
      <div className="w-full">
        <Button
          type="submit"
          form="validate-token-form"
          className="w-full cursor-pointer"
          disabled={loading || !isValid}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          {!loading && t('validate_token_submit_button_title')}
        </Button>
      </div>
    </form>
  );
}
