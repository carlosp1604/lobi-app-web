import { z } from 'zod'
import { AVAILABLE_CAPABILITIES } from "~/types/activity/capabiliy/AvailableCapabilities";

const BaseCapabilitySchema = z.object({
  name: z.enum(AVAILABLE_CAPABILITIES),
  isRequired: z.boolean()
})

export const ScalarCapabilitySchema = BaseCapabilitySchema.extend({
  type: z.enum(['scalar_range', 'scalar_point']),
  defaultUnit: z.string(),
  supportedUnits: z.array(z.string()),
  availableFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
  limits: z.object({
    min: z.string(),
    max: z.string()
  }),
  conversionFactors: z.record(z.string(), z.string())
})

export const GeographicCapabilitySchema = BaseCapabilitySchema.extend({
  type: z.enum(['geographic_range', 'geographic_point'])
})

export const RouteCapabilitySchema = BaseCapabilitySchema.extend({
  type: z.literal('route'),
  limits: z.object({
    min: z.coerce.number().int().nonnegative(),
    max: z.coerce.number().int().nonnegative(),
  })
})

const MultipleChoiceOptionSchema = z.object({
  id: z.uuid(),
  order: z.coerce.number().int().nonnegative(),
  slug: z.string(),
  imageUrl: z.url().nullable()
})

export const MultipleChoiceCapabilitySchema = BaseCapabilitySchema.extend({
  type: z.literal('multiple_choice'),
  min: z.coerce.number().int().nonnegative(),
  max: z.coerce.number().int().nonnegative(),
  options: z.array(MultipleChoiceOptionSchema)
})

export const CapabilitySchema = z.union([
  ScalarCapabilitySchema,
  GeographicCapabilitySchema,
  RouteCapabilitySchema,
  MultipleChoiceCapabilitySchema
]);

export type ScalarCapabilitySchemaDto = z.infer<typeof ScalarCapabilitySchema>
export type GeographicCapabilitySchemaDto = z.infer<typeof GeographicCapabilitySchema>
export type RouteCapabilitySchemaDto = z.infer<typeof RouteCapabilitySchema>
export type MultipleChoiceOptionSchemaDto = z.infer<typeof MultipleChoiceOptionSchema>
export type MultipleChoiceCapabilitySchemaDto = z.infer<typeof MultipleChoiceCapabilitySchema>
export type CapabilitySchemaDto = z.infer<typeof CapabilitySchema>
