import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://d2823a09239f1f959a97c3c5d28b0986@o4509994590470144.ingest.de.sentry.io/4511428854743120",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  enableLogs: true,
});
