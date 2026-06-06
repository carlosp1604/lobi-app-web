import { z } from 'zod'
import {
  GeographicCapabilitySchema,
  MultipleChoiceCapabilitySchema,
  RouteCapabilitySchema,
  ScalarCapabilitySchema
} from '~/types/activity/dto/CapabilitySchemaDto'

const capabilityValidatorMap: Record<string, z.ZodTypeAny> = {
  altitude: ScalarCapabilitySchema,
  distance: ScalarCapabilitySchema,
  duration: ScalarCapabilitySchema,
  rpe: ScalarCapabilitySchema,
  pace: ScalarCapabilitySchema,
  speed: ScalarCapabilitySchema,
  location: GeographicCapabilitySchema,
  location_range: GeographicCapabilitySchema,
  route: RouteCapabilitySchema,
  ranking: MultipleChoiceCapabilitySchema,
}

export class CapabilitySchemaFactory {
  static getValidator(capabilityName: string): z.ZodTypeAny {
    const validator = capabilityValidatorMap[capabilityName]

    if (!validator) {
      throw new Error(`API Payload validator for capability "${capabilityName}" is not registered`)
    }

    return validator
  }
}
