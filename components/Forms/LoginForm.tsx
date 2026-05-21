'use client'

import useTranslation from "next-translate/useTranslation";
import * as z from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {FieldDescription, FieldGroup} from "~/components/ui/field";
import {Button} from "~/components/ui/button";
import {Loader2} from "lucide-react";
import Link from "next/link";
import {PasswordInputField} from "~/components/Forms/Input/PasswordInput";
import { PasswordRegex} from '~/helpers/input.helper'
import {EmailInput} from "~/components/Forms/Input/EmailInput";
import {useAuth} from "~/hooks/useAuth";
import {Result} from "~/types/Result";

export interface LoginFormProps {
  loading: boolean;
  onActionComplete?: (result: Result<void, string>) => void;
}

export default function LoginForm({loading, onActionComplete}: LoginFormProps) {
  const { t } = useTranslation('auth');
  const { login } = useAuth();

  const loginSchema = z.object({
    email: z.email({ error: t('email_input_error_message')}),
    password: z.string().refine((value) => PasswordRegex.test(value), {
        message: t('password_input_error_message'),
      }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: LoginFormValues) {
    const result = await login(data.email, data.password);

    if (!result.success) {
      form.setError('email', { type: 'manual', message: '' });
      form.setError('password', { type: 'manual', message: '' });

      toast.error(t(result.error));

      if (onActionComplete) {
        onActionComplete(result)
      }

      return;
    }

    if (onActionComplete) {
      onActionComplete(result)
    }
  }

  const { isValid } = form.formState;

  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-2"
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({field, fieldState}) => (
            <EmailInput
              label={t('email_label_title')}
              placeholder={t('email_input_placeholder')}
              field={field}
              fieldState={fieldState}
            />
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({field, fieldState}) => (
            <PasswordInputField
              label={t('password_label_title')}
              placeholder={t('password_input_placeholder')}
              help={{
                helpButtonTitle: t('password_help_button_title'),
                title: t('password_help_title'),
                description: t('password_help_description'),
                showPasswordTitle: t('password_show_password_button_title'),
                hidePasswordTitle: t('password_hide_password_button_title')
              }}
              field={field}
              fieldState={fieldState}
            />
          )}
        />
      </FieldGroup>
      <div className="flex flex-col items-center gap-y-4 pt-2">
        <Button
          type="submit"
          form="login-form"
          className="w-full cursor-pointer"
          disabled={loading || !isValid}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          {!loading && t('login_submit_button_title')}
        </Button>
        <div className="flex flex-col items-center gap-y-2 text-sm text-muted-foreground w-full">
          <Link
            href="/auth/reset/"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            {t('login_retrieve_password_link_title')}
          </Link>
          <FieldDescription className="text-center">
            {t('login_signup_question_title')}{' '}
            <Link
              href="/auth/signup/"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              {t('login_signup_link_title')}
            </Link>
          </FieldDescription>
        </div>
      </div>
    </form>
  );
}
