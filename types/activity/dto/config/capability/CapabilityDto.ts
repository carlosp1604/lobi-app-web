import { z } from 'zod'
import { AVAILABLE_CAPABILITIES } from '~/types/activity/capabiliy/AvailableCapabilities'

export const DisplayValueSchema = z.object({
  long: z.string(),
  short: z.string(),
})

export const MagnitudeDtoSchema = z.object({
  value: z.string(),
  unit: z.string(),
  conversions: z.record(z.string(), z.string()).optional(),
  formatted: z.record(z.string(), DisplayValueSchema),
  format: z.union([z.string(), z.array(z.string())]).optional(),
})

export const MagnitudeRangeDtoSchema = z.object({
  start: MagnitudeDtoSchema,
  end: MagnitudeDtoSchema,
  average: MagnitudeDtoSchema.optional(),
  isSingleValue: z.boolean(),
  unit: z.string(),
})

export const LocationDtoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
})

export const LocationRangeDtoSchema = z.object({
  start: LocationDtoSchema,
  end: LocationDtoSchema,
})

// Not active
export const RouteDtoSchema = z.record(z.string(), z.unknown())

export const CapabilityDtoTypeSchema = z.enum([
  'scalar_range',
  'scalar_point',
  'geographic_range',
  'geographic_point',
  'route',
  'multiple_choice',
])

export const BaseCapabilityDtoSchema = z.object({
  name: z.enum(AVAILABLE_CAPABILITIES),
  type: CapabilityDtoTypeSchema,
})

export const MagnitudeCapabilityDtoSchema = BaseCapabilityDtoSchema.extend({
  type: z.literal('scalar_point'),
  data: MagnitudeDtoSchema,
})

export const MagnitudeRangeCapabilityDtoSchema = BaseCapabilityDtoSchema.extend({
  type: z.literal('scalar_range'),
  data: MagnitudeRangeDtoSchema,
})

export const LocationCapabilityDtoSchema = BaseCapabilityDtoSchema.extend({
  type: z.literal('geographic_point'),
  data: LocationDtoSchema,
})

export const LocationRangeCapabilityDtoSchema = BaseCapabilityDtoSchema.extend({
  type: z.literal('geographic_range'),
  data: LocationRangeDtoSchema,
})

export const RouteCapabilityDtoSchema = BaseCapabilityDtoSchema.extend({
  type: z.literal('route'),
  data: RouteDtoSchema,
})

export const MultipleChoiceCapabilityDtoSchema = BaseCapabilityDtoSchema.extend({
  type: z.literal('multiple_choice'),
  data: z.object({
    ids: z.array(z.string()),
  }),
})

export const ActivityCapabilityDtoSchema = z.discriminatedUnion('name', [
  MagnitudeCapabilityDtoSchema,
  MagnitudeRangeCapabilityDtoSchema,
  LocationCapabilityDtoSchema,
  LocationRangeCapabilityDtoSchema,
  RouteCapabilityDtoSchema,
  MultipleChoiceCapabilityDtoSchema,
])

export type DisplayValue = z.infer<typeof DisplayValueSchema>
export type MagnitudeDto = z.infer<typeof MagnitudeDtoSchema>
export type MagnitudeRangeDto = z.infer<typeof MagnitudeRangeDtoSchema>
export type LocationDto = z.infer<typeof LocationDtoSchema>
export type LocationRangeDto = z.infer<typeof LocationRangeDtoSchema>
export type RouteDto = z.infer<typeof RouteDtoSchema>

export type CapabilityDtoType = z.infer<typeof CapabilityDtoTypeSchema>
export type BaseCapabilityDto = z.infer<typeof BaseCapabilityDtoSchema>
export type MagnitudeCapabilityDto = z.infer<typeof MagnitudeCapabilityDtoSchema>
export type MagnitudeRangeCapabilityDto = z.infer<typeof MagnitudeRangeCapabilityDtoSchema>
export type LocationCapabilityDto = z.infer<typeof LocationCapabilityDtoSchema>
export type LocationRangeCapabilityDto = z.infer<typeof LocationRangeCapabilityDtoSchema>
export type RouteCapabilityDto = z.infer<typeof RouteCapabilityDtoSchema>
export type MultipleChoiceCapabilityDto = z.infer<typeof MultipleChoiceCapabilityDtoSchema>

export type ActivityCapabilityDto = z.infer<typeof ActivityCapabilityDtoSchema>


