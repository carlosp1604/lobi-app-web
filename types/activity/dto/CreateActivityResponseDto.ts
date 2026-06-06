import { z } from 'zod'

export const CreateActivityCommandResponseSchema = z.object({
  id: z.uuid(),
})

export type CreateActivityCommandResponseDto = z.infer<typeof CreateActivityCommandResponseSchema>
