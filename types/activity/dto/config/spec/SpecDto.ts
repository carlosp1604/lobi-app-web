import { z } from "zod";
import { AVAILABLE_SPECS } from "~/types/activity/spec/AvailableSpecs";

export const ParticipationConfigTypeSchema = z.enum(['individual', 'team']);

export const IndividualParticipantsConfigDtoSchema = z.object({
  type: z.literal('individual'),
  minPlayers: z.number(),
  maxPlayers: z.number()
});

export const TeamParticipantsConfigDtoSchema = z.object({
  type: z.literal('team'),
  minPlayers: z.number(),
  minTeams: z.number(),
  maxTeams: z.number(),
  playersPerTeam: z.number()
});

export const BaseSpecDtoSchema = z.object({
  name: z.enum(AVAILABLE_SPECS)
});

export const IndividualParticipantsSpecDtoSchema = BaseSpecDtoSchema.extend({
  data: IndividualParticipantsConfigDtoSchema
});

export const TeamParticipantsSpecDtoSchema = BaseSpecDtoSchema.extend({
  data: TeamParticipantsConfigDtoSchema
});

export const ActivitySpecDtoSchema = z.discriminatedUnion('name', [
  IndividualParticipantsSpecDtoSchema,
  TeamParticipantsSpecDtoSchema,
]);

export type ParticipationConfigType = z.infer<typeof ParticipationConfigTypeSchema>;
export type IndividualParticipantsConfigDto = z.infer<typeof IndividualParticipantsConfigDtoSchema>;
export type TeamParticipantsConfigDto = z.infer<typeof TeamParticipantsConfigDtoSchema>;
export type BaseSpecDto = z.infer<typeof BaseSpecDtoSchema>;
export type IndividualParticipantsSpecDto = z.infer<typeof IndividualParticipantsSpecDtoSchema>;
export type TeamParticipantsSpecDto = z.infer<typeof TeamParticipantsSpecDtoSchema>;

export type ActivitySpecDto = z.infer<typeof ActivitySpecDtoSchema>;
