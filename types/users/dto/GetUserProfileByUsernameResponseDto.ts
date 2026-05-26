import { z } from 'zod';

export const GetUserProfileByUsernameResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  username: z.string().min(1),
  imageUrl: z.url().nullable(),
  bio: z.string().nullable(),
  birthDate: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});

export type GetUserProfileByUsernameResponseDto = z.infer<typeof GetUserProfileByUsernameResponseSchema>;
