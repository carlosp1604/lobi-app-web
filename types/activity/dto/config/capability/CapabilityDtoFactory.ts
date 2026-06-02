import { z } from 'zod'
import { AvailableCapability } from "~/types/activity/capabiliy/AvailableCapabilities";
import {
  LocationCapabilityDtoSchema,
  LocationRangeCapabilityDtoSchema,
  MagnitudeRangeCapabilityDtoSchema,
  MultipleChoiceCapabilityDtoSchema,
  RouteCapabilityDtoSchema,
} from "~/types/activity/dto/config/capability/CapabilityDto";

const capabilityValidatorMap: Record<AvailableCapability, z.ZodTypeAny> = {
  altitude: MagnitudeRangeCapabilityDtoSchema,
  distance: MagnitudeRangeCapabilityDtoSchema,
  duration: MagnitudeRangeCapabilityDtoSchema,
  rpe: MagnitudeRangeCapabilityDtoSchema,
  pace: MagnitudeRangeCapabilityDtoSchema,
  speed: MagnitudeRangeCapabilityDtoSchema,
  location: LocationCapabilityDtoSchema,
  location_range: LocationRangeCapabilityDtoSchema,
  route: RouteCapabilityDtoSchema,
  ranking: MultipleChoiceCapabilityDtoSchema,
}

export class CapabilityDtoFactory {
  static getValidator(capabilityName: AvailableCapability): z.ZodTypeAny {
    const validator = capabilityValidatorMap[capabilityName]

    if (!validator) {
      throw new Error(`Capability DTO validator for capability "${capabilityName}" is not registered`)
    }

    return validator
  }
}
