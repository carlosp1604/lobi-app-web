import { z } from "zod";
import { Translate } from "next-translate";
import { IndividualParticipantsSpecSchemaDto } from "~/types/activity/dto/SpecSchemaDto";

const IndividualParticipantsSchema = z.object({
  minPlayers: z.coerce.number().int(),
  maxPlayers: z.coerce.number().int()
})

export type IndividualParticipantsSpecDto = z.infer<typeof IndividualParticipantsSchema>

export const createIndividualParticipantsSpecSchema = (config: IndividualParticipantsSpecSchemaDto, t: Translate) => {
  return IndividualParticipantsSchema.superRefine((value, ctx) => {
    const { minPlayers, maxPlayers } = value
    const { min: configMinPlayers, max: configMaxPlayers } = config.players

    if (minPlayers < configMinPlayers || minPlayers > configMaxPlayers) {
      ctx.addIssue({
        code: 'custom',
        path: ['minPlayers'],
        message: t('individual_participants_min_players_invalid_range_message_title', {
          min: configMinPlayers,
          max: configMaxPlayers
        })
      })
    }

    if (maxPlayers < configMinPlayers || maxPlayers > configMaxPlayers) {
      ctx.addIssue({
        code: 'custom',
        path: ['maxPlayers'],
        message: t('individual_participants_max_players_invalid_range_message_title', {
          min: configMinPlayers,
          max: configMaxPlayers
        })
      })
    }

    if (minPlayers > maxPlayers) {
      ctx.addIssue({
        code: 'custom',
        path: ['maxPlayers'],
        message: t('individual_participants_invalid_max_players_message_title')
      })
    }
  })
}

export const createIndividualParticipantsSpecDefaultValue = (config: IndividualParticipantsSpecSchemaDto) => {
  return {
    minPlayers: config.defaultMinPlayers,
    maxPlayers: config.defaultMaxPlayers
  };
}

export const formatIndividualParticipantsSpecData = (data: IndividualParticipantsSpecDto,t: Translate): string => {
  const { minPlayers, maxPlayers } = data;

  if (minPlayers === maxPlayers) {
    return t('individual_participants_point_summary_title', { players: minPlayers });
  }

  return t('individual_participants_range_summary_title', { minPlayers, maxPlayers });
}

export const buildIndividualParticipantsSpecPayload = (data: IndividualParticipantsSpecDto) => {
  return {
    minPlayers: data.minPlayers,
    maxPlayers: data.maxPlayers,
  };
};
