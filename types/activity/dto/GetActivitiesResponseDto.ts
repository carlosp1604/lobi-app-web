import { z } from 'zod'
import { LocationDtoSchema, MagnitudeDtoSchema } from '~/types/activity/dto/config/capability/CapabilityDto'
import {
  SportDtoSchema,
  SportLevelDtoSchema,
  ActivityHostDtoSchema,
  ActivityParticipationDtoSchema
} from '~/types/activity/dto/GetActivityResponseDto'
import {
  GetActivitiesSortByOptions, GetActivitiesSortDirectionOptions
} from '~/types/activity/GetActivitiesAllowedParams'
import { DecimalStringSchema } from '~/types/shared/DecimalStringSchema'
import { ValidActivityStatus } from '~/types/activity/ActivityStatus'

export const GeographicFilterSchema = z.object({
  lat: DecimalStringSchema,
  lng: DecimalStringSchema,
})

export const IntegerNumericValueFilterSchema = z.coerce.number().int().nonnegative()

export const NumericValueFilterSchema = z.coerce.number().nonnegative()

export const UUIDFilterSchema = z.uuid()

export const UUIDArrayFilterSchema = z.array(UUIDFilterSchema)

export const StringArrayFilterSchema = z.array(z.enum(ValidActivityStatus))

export type GeographicFilterSchemaDto = z.infer<typeof GeographicFilterSchema>
export type IntegerNumericValueFilterSchemaDto = z.infer<typeof IntegerNumericValueFilterSchema>
export type NumericValueFilterSchemaDto = z.infer<typeof NumericValueFilterSchema>
export type UUIDFilterSchemaDto = z.infer<typeof UUIDFilterSchema>
export type UUIDArrayFilterSchemaDto = z.infer<typeof UUIDArrayFilterSchema>
export type StringArrayFilterSchemaDto = z.infer<typeof StringArrayFilterSchema>

export const GetActivitiesActiveFiltersDtoSchema = z.object({
  location: GeographicFilterSchema.optional(),
  radius: NumericValueFilterSchema.optional(),
  maxDateSeconds: IntegerNumericValueFilterSchema.optional(),
  statuses: StringArrayFilterSchema.optional(),
  sportId: UUIDFilterSchema.optional(),
  minDuration: IntegerNumericValueFilterSchema.optional(),
  maxDuration: IntegerNumericValueFilterSchema.optional(),
  minFreeSlots: IntegerNumericValueFilterSchema.optional(),
  levelIds: UUIDArrayFilterSchema.optional(),
  hostId: UUIDFilterSchema.optional(),
  participantId: UUIDFilterSchema.optional(),
})

export const GetActivitiesPaginationDtoSchema = z.object({
  page: z.coerce.number().int().nonnegative(),
  perPage: z.coerce.number().int().nonnegative(),
})

export const GetActivitiesSortDtoSchema = z.object({
  direction: z.enum(GetActivitiesSortDirectionOptions),
  by: z.enum(GetActivitiesSortByOptions),
})

export const TeamConfigDtoSchema = z.object({
  minTeams: z.coerce.number().int().nonnegative(),
  maxTeams: z.coerce.number().int().nonnegative(),
  playersPerTeam: z.coerce.number().int().nonnegative(),
})

export const ActivityListItemDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  location: LocationDtoSchema.nullable(),
  capacity: z.object({
    min: z.coerce.number().int().nonnegative(),
    max: z.coerce.number().int().nonnegative(),
  }),
  duration: z.object({
    min: MagnitudeDtoSchema,
    max: MagnitudeDtoSchema,
  }).nullable(),
  currentParticipants: z.number(),
  createdAt: z.string(),
  scheduledAt: z.string(),
  levels: z.array(SportLevelDtoSchema),
  teamConfig: TeamConfigDtoSchema.nullable(),
  participation: ActivityParticipationDtoSchema.nullable(),
  host: ActivityHostDtoSchema.nullable(),
  sport: SportDtoSchema,
  isHost: z.boolean(),
  isParticipant: z.boolean(),
})

export const GetActivitiesResponseDtoSchema = z.object({
  items: z.array(ActivityListItemDtoSchema),
  activeFilters: GetActivitiesActiveFiltersDtoSchema,
  pagination: GetActivitiesPaginationDtoSchema,
  sort: GetActivitiesSortDtoSchema,
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  total: z.coerce.number().int().nonnegative(),
})

export type GetActivitiesActiveFiltersDto = z.infer<typeof GetActivitiesActiveFiltersDtoSchema>
export type GetActivitiesPaginationDto = z.infer<typeof GetActivitiesPaginationDtoSchema>
export type GetActivitiesSortDto = z.infer<typeof GetActivitiesSortDtoSchema>
export type TeamConfigDto = z.infer<typeof TeamConfigDtoSchema>
export type ActivityListItemDto = z.infer<typeof ActivityListItemDtoSchema>
export type GetActivitiesResponseDto = z.infer<typeof GetActivitiesResponseDtoSchema>
