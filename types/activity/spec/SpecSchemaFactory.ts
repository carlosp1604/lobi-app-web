import { z } from 'zod'
import {
  IndividualParticipantsSpecSchema,
  TeamParticipantsSpecSchema
} from '~/types/activity/dto/SpecSchemaDto'

const specValidatorMap: Record<string, z.ZodTypeAny> = {
  individual_participants: IndividualParticipantsSpecSchema,
  team_participants: TeamParticipantsSpecSchema,
}

export class SpecSchemaFactory {
  static getValidator(specName: string): z.ZodTypeAny {
    const validator = specValidatorMap[specName]

    if (!validator) {
      throw new Error(`API Payload validator for spec "${specName}" is not registered`)
    }

    return validator
  }
}
