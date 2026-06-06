import { z } from 'zod'
import { FieldErrorDetailTypes } from '~/types/AppServiceError'

export const StandardApiErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
})

export const NotificationErrorItemSchema = z.object({
  field: z.string(),
  error: z.string().optional(),
  type: z.enum(FieldErrorDetailTypes),
})

export const NotificationErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  errors: z.array(NotificationErrorItemSchema),
})

export const ApiErrorResponseSchema = z.union([
  NotificationErrorResponseSchema,
  StandardApiErrorResponseSchema,
])

export type StandardApiErrorResponseDto = z.infer<typeof StandardApiErrorResponseSchema>
export type NotificationErrorItem = z.infer<typeof NotificationErrorItemSchema>
export type NotificationErrorResponseDto = z.infer<typeof NotificationErrorResponseSchema>
export type ApiErrorResponseDto = z.infer<typeof ApiErrorResponseSchema>
