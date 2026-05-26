import { z } from 'zod';

export const RelativeDateSchema = z.object({
  quantity: z.number().int().nonnegative(),
  unit: z.enum(['minutes', 'hours', 'days', 'months', 'years']),
});

export const DeviceLocationSchema = z.object({
  countryCode: z.string().nullable(),
  city: z.string().nullable(),
});

export const DeviceInfoSchema = z.object({
  raw: z.string(),
  browser: z.object({
    name: z.string().nullable(),
    version: z.string().nullable(),
  }),
  os: z.object({
    name: z.string().nullable(),
    version: z.string().nullable(),
  }),
  hardware: z.object({
    type: z.string().nullable(),
    vendor: z.string().nullable(),
    model: z.string().nullable(),
  }),
});

export const UserActiveSessionsSchema = z.object({
  id: z.uuid(),
  deviceLocation: DeviceLocationSchema,
  deviceInfo: DeviceInfoSchema,
  activeSince: RelativeDateSchema,
  expiresAt: RelativeDateSchema,
  isCurrent: z.boolean(),
});

export const UserCredentialSchema = z.object({
  lastModifiedAt: RelativeDateSchema,
});

export const GetUserSecurityDetailsQueryResponseSchema = z.object({
  sessions: z.array(UserActiveSessionsSchema),
  credential: UserCredentialSchema,
});

export type RelativeDateDto = z.infer<typeof RelativeDateSchema>;
export type DeviceLocationDto = z.infer<typeof DeviceLocationSchema>;
export type DeviceInfoDto = z.infer<typeof DeviceInfoSchema>;
export type UserActiveSessionsDto = z.infer<typeof UserActiveSessionsSchema>;
export type UserCredentialDto = z.infer<typeof UserCredentialSchema>;
export type GetUserSecurityDetailsQueryResponseDto = z.infer<typeof GetUserSecurityDetailsQueryResponseSchema>;
