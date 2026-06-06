import { z } from 'zod'
import { AVAILABLE_SPECS } from '~/types/activity/spec/AvailableSpecs'

export const AllowedParticipantSpecSchema = z.enum(AVAILABLE_SPECS)

const BaseParticipantsSpecSchemaDto = z.object({
  allowedSpecs: z.array(AllowedParticipantSpecSchema),
  defaultSpec: AllowedParticipantSpecSchema,
  availableFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
})

export const IndividualParticipantsSpecSchema = BaseParticipantsSpecSchemaDto.extend({
  defaultMinPlayers: z.coerce.number().int().nonnegative(),
  defaultMaxPlayers: z.coerce.number().int().nonnegative(),
  players: z.object({
    min: z.coerce.number().int().nonnegative(),
    max: z.coerce.number().int().nonnegative(),
  }),
})

export const TeamParticipantsSpecSchema = BaseParticipantsSpecSchemaDto.extend({
  defaultPlayers: z.coerce.number().int().nonnegative(),
  defaultTeams: z.coerce.number().int().nonnegative(),
  defaultPlayersPerTeam: z.coerce.number().int().nonnegative(),
  playersPerTeam: z.object({
    min: z.coerce.number().int().nonnegative(),
    max: z.coerce.number().int().nonnegative(),
  }),
  teams: z.object({
    min: z.coerce.number().int().nonnegative(),
    max: z.coerce.number().int().nonnegative(),
  }),
})

export const SpecSchema = z.union([
  IndividualParticipantsSpecSchema,
  TeamParticipantsSpecSchema,
])

export type IndividualParticipantsSpecSchemaDto = z.infer<typeof IndividualParticipantsSpecSchema>
export type TeamParticipantsSpecSchemaDto = z.infer<typeof TeamParticipantsSpecSchema>
export type SpecSchemaDto = z.infer<typeof SpecSchema>
