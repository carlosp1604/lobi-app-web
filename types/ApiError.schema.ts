import { z } from 'zod'

export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  timestamp: z.iso.datetime(),
  requestId: z.string().min(1),
  path: z.string().startsWith('/'),
  response: z.any(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>
