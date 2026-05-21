export interface ServiceError {
  readonly apiCode: string
  readonly key: string
}

export type ServiceErrorLegacy = ServiceError | {
  readonly errors: Array<ServiceError>
}
