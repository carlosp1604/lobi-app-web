import { ApiClientErrorEnvelope } from "~/helpers/ApiClient";

export const FieldErrorDetailTypes = ['validation', 'conflict', 'unavailable', 'missing'] as const;
export type FieldErrorDetailType = (typeof FieldErrorDetailTypes)[number];

export interface FieldErrorDetail {
  readonly key: string;
  readonly type: FieldErrorDetailType;
}

export type ServiceErrorKind = 'standard' | 'form' | 'non-ui';

export class AppServiceError {
  public readonly infrastructure: ApiClientErrorEnvelope;

  private readonly key: string;
  private readonly apiCode?: string;
  private readonly statusCode?: number;
  private readonly fields?: Record<string, FieldErrorDetail>;
  private readonly kind: ServiceErrorKind

  private constructor(
    infrastructure: ApiClientErrorEnvelope,
    key: string,
    kind: ServiceErrorKind,
    apiCode?: string,
    statusCode?: number,
    fields?: Record<string, FieldErrorDetail>,
  ) {
    this.infrastructure = infrastructure;
    this.key = key;
    this.kind = kind;
    this.apiCode = apiCode;
    this.statusCode = statusCode;
    this.fields = fields;
  }

  static createStandard(key: string, apiCode: string, envelope: ApiClientErrorEnvelope): AppServiceError {
    if (envelope.type !== 'api') {
      throw new Error('[AppServiceError] createStandard requires an "api" type envelope');
    }

    return new AppServiceError(envelope, key, 'standard', apiCode, envelope.statusCode, undefined);
  }

  static createForm(
    key: string,
    apiCode: string,
    fields: Record<string, FieldErrorDetail>,
    envelope: ApiClientErrorEnvelope
  ): AppServiceError {
    if (envelope.type !== 'api') {
      throw new Error('[AppServiceError] createForm requires an "api" type envelope');
    }

    return new AppServiceError(envelope, key, 'form', apiCode, envelope.statusCode, fields);
  }

  static createNonUIError(envelope: ApiClientErrorEnvelope): AppServiceError {
    if (envelope.type === 'api') {
      throw new Error('[AppServiceError] createNonUIError cannot receive an "api" type envelope');
    }

    const key = 'api-errors:unexpected_client_error_message_title';

    const statusCode = envelope.type === 'validation' ? envelope.statusCode : undefined;

    return new AppServiceError(envelope, key, 'non-ui', undefined, statusCode, undefined);
  }

  public isApiError(): boolean {
    return this.infrastructure.type === 'api';
  }

  public isStandard(): boolean {
    return this.kind === 'standard';
  }

  public isForm(): boolean {
    return this.kind === 'form';
  }

  public getTranslationKey(): string {
    return this.key;
  }

  public isApiErrorType(code: string | Array<string>): boolean {
    if (!this.apiCode) {
      return false;
    }

    if (Array.isArray(code)) {
      return code.includes(this.apiCode);
    }

    return this.apiCode === code;
  }

  public isStatusCode(code: number): boolean {
    if (!this.statusCode) {
      return false;
    }

    return this.statusCode === code;
  }

  public getFieldError(fieldName: string): FieldErrorDetail | undefined {
    return this.fields?.[fieldName];
  }

  public getFields(): Record<string, FieldErrorDetail> {
    return this.fields ?? {};
  }

  public hasConflictError(fieldName: string): boolean {
    const field = this.getFieldError(fieldName);

    if (!field) {
      return false;
    }

    return field.type === 'conflict';
  }

  public hasValidationError(fieldName: string): boolean {
    const field = this.getFieldError(fieldName);

    if (!field) {
      return false;
    }

    return field.type === 'validation';
  }

  public getRequestId(): string {
    if (this.infrastructure.type === 'api' || this.infrastructure.type === 'validation') {
      return this.infrastructure.requestId;
    }

    return 'unknown';
  }
}
