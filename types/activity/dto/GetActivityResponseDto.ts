import { z } from 'zod';
import { AvailableSpec } from "~/types/activity/spec/AvailableSpecs";
import { SpecDtoFactory } from "~/types/activity/dto/config/spec/SpecDtoFactory";
import { AvailableCapability } from "~/types/activity/capabiliy/AvailableCapabilities";
import { ValidActivityStatus } from "~/types/activity/ActivityStatus";
import { CapabilityDtoFactory } from "~/types/activity/dto/config/capability/CapabilityDtoFactory";
import { LocationDtoSchema, MagnitudeDtoSchema } from "~/types/activity/dto/config/capability/CapabilityDto";

export const ActivityConfigDtoSchema = z.object({
  capabilities: z.record(z.string(), z.unknown()).superRefine((capabilitiesRecord, ctx) => {
    for (const [key, value] of Object.entries(capabilitiesRecord)) {
      const validator = CapabilityDtoFactory.getValidator(key as AvailableCapability);
      const result = validator.safeParse(value);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [key, ...issue.path]
          });
        });
      }
    }
  }),

  specs: z.record(z.string(), z.unknown()).superRefine((specsRecord, ctx) => {
    for (const [key, value] of Object.entries(specsRecord)) {
      const validator = SpecDtoFactory.getValidator(key as AvailableSpec);
      const result = validator.safeParse(value);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [key, ...issue.path]
          });
        });
      }
    }
  })
});

export const ActivityParticipationDtoSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  joinedAt: z.iso.datetime()
});

export const ActivityHostDtoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  username: z.string()
});

export const SportDtoSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  imageUrl: z.url().nullable()
});

export const SportLevelDtoSchema = z.object({
  id: z.string(),
  slug: z.string(),
  order: z.coerce.number().int().nonnegative(),
  imageUrl: z.url().nullable()
});

export const ActivityDetailsDtoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(ValidActivityStatus),
  location: LocationDtoSchema.nullable(),
  capacity: z.object({
    min: z.number().int().nonnegative(),
    max: z.number().int().nonnegative()
  }),
  duration: z.object({
    min: MagnitudeDtoSchema,
    max: MagnitudeDtoSchema
  }).nullable(),
  currentParticipants: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  scheduledAt: z.iso.datetime(),
  activityConfig: ActivityConfigDtoSchema,
  levels: z.array(SportLevelDtoSchema)
});

export const GetActivityResponseDtoSchema = z.object({
  activity: ActivityDetailsDtoSchema,
  participation: ActivityParticipationDtoSchema.nullable(),
  host: ActivityHostDtoSchema.nullable(),
  sport: SportDtoSchema,
  isHost: z.boolean(),
  isParticipant: z.boolean()
});

export type ActivityConfigDto = z.infer<typeof ActivityConfigDtoSchema>;
export type ActivityParticipationDto = z.infer<typeof ActivityParticipationDtoSchema>;
export type ActivityHostDto = z.infer<typeof ActivityHostDtoSchema>;
export type SportDto = z.infer<typeof SportDtoSchema>;
export type ActivityDetailsDto = z.infer<typeof ActivityDetailsDtoSchema>;
export type GetActivityResponseDto = z.infer<typeof GetActivityResponseDtoSchema>;
