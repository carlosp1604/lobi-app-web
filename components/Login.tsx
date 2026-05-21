'use client'

import useTranslation from "next-translate/useTranslation";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {useAuth} from "~/hooks/useAuth";
import LoginForm from "~/components/Forms/LoginForm";
import {Result} from "~/types/Result";
import {useEffect} from "react";
import {getSanitizedCallbackUrlForLogin} from "~/helpers/callbackUrlSanitizer.helper"

export default function Login() {
  const { t } = useTranslation('auth');
  const {status} = useAuth();
  const isLoading = status === 'loading';
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === 'authenticated' && searchParams) {
      const rawCallbackUrl = searchParams.get('callbackUrl') || '/';
      const callbackUrl = getSanitizedCallbackUrlForLogin(rawCallbackUrl);

      router.replace(callbackUrl);
    }
  }, [status, router, searchParams]);

  if (!searchParams) {
    // TODO: Skeleton
    return null
  }
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/';

  const callbackUrl = getSanitizedCallbackUrlForLogin(rawCallbackUrl);

  const onLoginComplete = (result: Result<void, string>): void => {
    if (result.success) {
      toast.success(t('login_success_message_title'));

      router.push(callbackUrl);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md pt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {t('login_header_title')}
          </CardTitle>
          <CardDescription>
            {t('login_header_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            loading={isLoading}
            onActionComplete={ onLoginComplete }
          />
        </CardContent>
      </Card>
    </div>
  );
}
