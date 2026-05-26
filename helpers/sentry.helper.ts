import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { ApiClientErrorEnvelope } from "~/helpers/ApiClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'unknown-base-url';

const SENSITIVE_FIELDS = new Set([
  'password',
  'confirmpassword',
  'token',
  'accesstoken',
  'oldpassword',
  'newpassword',
  'authorization',
  'refresh_token',
  'refreshtoken'
]);

function safeSerializeAndSanitize(target: unknown): string | undefined {
  if (target === undefined || target === null) {
    return undefined;
  }

  if (Buffer.isBuffer(target)) {
    return '[Buffer]';
  }

  try {
    return JSON.stringify(target, (key, value: unknown) => {
      const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      if (cleanKey && SENSITIVE_FIELDS.has(cleanKey)) {
        return '[redacted]';
      }
      return value;
    }, 2);
  } catch {
    return '[unserializable or circular reference]';
  }
}

export function reportApiErrorToSentry(
  envelope: ApiClientErrorEnvelope,
  requestBody?: Record<string, unknown>,
): void {
  const isNetwork = envelope.type === 'network';

  const serializedRequest = safeSerializeAndSanitize(requestBody)

  let rawResponse: unknown = null;
  if (envelope.type === 'api' || envelope.type === 'validation') {
    rawResponse = envelope.response;
  } else if (envelope.type === 'network') {
    rawResponse = envelope.error;
  }

  const serializedResponse = safeSerializeAndSanitize(rawResponse)

  let apiCode = 'none';
  if (
    !isNetwork &&
    envelope.response &&
    typeof envelope.response === 'object' &&
    'code' in envelope.response
  ) {
    apiCode = String((envelope.response as Record<string, unknown>).code);
  }

  const statusCode = isNetwork ? 0 : envelope.statusCode;
  const requestId = isNetwork ? 'no-request-id' : envelope.requestId;
  const fullUrl = `${API_URL}${envelope.path}`;

  const contexts: Record<string, Record<string, unknown>> = {
    'API Context': {
      type: envelope.type,
      method: envelope.method,
      path: envelope.path,
      apiBaseUrl: API_URL,
      fullUrl: fullUrl,
      statusCode: statusCode,
      requestId: requestId,
      info: isNetwork ? envelope.code : ('timestamp' in envelope ? envelope.timestamp : 'no-timestamp'),
    },
    'API Data Payload': {
      requestPayload: serializedRequest,
      responsePayload: serializedResponse,
    },
  };

  if (envelope.type === 'validation' && envelope.error?.issues) {
    const prettyErrors = z.prettifyError(envelope.error);
    contexts['Zod Validation Issues'] = {
      code: envelope.code,
      errors: prettyErrors
    };
  }

  Sentry.captureException(
    new Error(`[ApiClient: ${envelope.type.toUpperCase()}] ${envelope.method} ${envelope.path}`),
    {
      tags: {
        component: 'api-client',
        'error.type': envelope.type,
        'http.status_code': statusCode.toString(),
        'http.method': envelope.method,
        'api.code': apiCode,
        'api.request_id': requestId,
      },
      contexts,
    },
  );
}
