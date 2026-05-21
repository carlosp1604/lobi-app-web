import * as Sentry from "@sentry/nextjs";
import { ApiErrorEnvelope } from "~/helpers/ApiClient";

interface RequestMetadata {
  url: string;
  method: string;
  body?: unknown;
}

export function reportApiErrorToSentry(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  envelope: ApiErrorEnvelope<any>,
  request: RequestMetadata,
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sanitizedBody: any = null;

  if (request.body && typeof request.body === 'object') {
    sanitizedBody = JSON.parse(JSON.stringify(request.body));

    const sensitiveFields = ['password', 'confirmPassword', 'token', 'accessToken', 'oldPassword', 'newPassword'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitize = (obj: any) => {
      for (const key in obj) {
        if (sensitiveFields.includes(key)) {
          obj[key] = '[redacted]';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(sanitizedBody);
  }

  const apiCode = envelope.response?.code || 'none';

  Sentry.captureException(
    new Error(`API Error ${envelope.statusCode} on ${request.method.toUpperCase()} ${envelope.path}`),
    {
      tags: {
        "component": "api-client",
        "http.status_code": envelope.statusCode.toString(),
        "http.method": request.method.toUpperCase(),
        "api.code": apiCode,
        "api.request_id": envelope.requestId,
      },
      contexts: {
        "API Response": {
          statusCode: envelope.statusCode,
          path: envelope.path,
          timestamp: envelope.timestamp,
          requestId: envelope.requestId,
          rawResponse: envelope.response,
        },
        "API Request Metadata": {
          fullUrl: request.url,
          payload: sanitizedBody,
        },
      },
    }
  );
}
