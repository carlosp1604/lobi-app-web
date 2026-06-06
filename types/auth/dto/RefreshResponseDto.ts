import { z } from 'zod'

export const RefreshResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  sessionId: z.uuid(),
  accessTokenExpiresAt: z.iso.datetime(),
  refreshTokenExpiresAt: z.iso.datetime(),
  userData: z.object({
    id: z.uuid(),
    name: z.string().min(1),
    username: z.string().min(1),
    imageUrl: z.url().nullable(),
  }),
})

export type RefreshResponseDto = z.infer<typeof RefreshResponseSchema>
