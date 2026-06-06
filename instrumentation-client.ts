// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://d2823a09239f1f959a97c3c5d28b0986@o4509994590470144.ingest.de.sentry.io/4511428854743120',

  // Enable logs to be sent to Sentry
  enableLogs: true,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
