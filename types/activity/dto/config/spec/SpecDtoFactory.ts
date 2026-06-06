import { z } from 'zod'
import { AvailableSpec } from '~/types/activity/spec/AvailableSpecs'
import {
  IndividualParticipantsSpecDtoSchema,
  TeamParticipantsSpecDtoSchema
} from '~/types/activity/dto/config/spec/SpecDto'

const specValidatorMap: Record<AvailableSpec, z.ZodTypeAny> = {
  individual_participants: IndividualParticipantsSpecDtoSchema,
  team_participants: TeamParticipantsSpecDtoSchema,
}

export class SpecDtoFactory {
  static getValidator(specName: AvailableSpec): z.ZodTypeAny {
    const validator = specValidatorMap[specName]

    if (!validator) {
      throw new Error(`Spec DTO validator for spec "${specName}" is not registered`)
    }

    return validator
  }
}
