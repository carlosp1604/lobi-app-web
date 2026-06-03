import "~/styles/globals.css";
import AppLayout from "~/components/layout/AppLayout";
import type { AppProps } from "next/app";
import { AuthProvider } from "~/context/AuthContext";
import { PagesProgressProvider as ProgressProvider } from '@bprogress/next';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProgressProvider
      height="4px"
      color="#0076D2FF"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <AuthProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AuthProvider>
    </ProgressProvider>
  );
}
