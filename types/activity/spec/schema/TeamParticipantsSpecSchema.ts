import { z } from 'zod'
import { Translate } from 'next-translate'
import { TeamParticipantsSpecSchemaDto } from '~/types/activity/dto/SpecSchemaDto'

const TeamParticipantsSchema = z.object({
  minTeams: z.coerce.number().int(),
  maxTeams: z.coerce.number().int(),
  playersPerTeam: z.coerce.number().int(),
  minPlayers: z.coerce.number().int().nullable(),
})

export const MIN_PLAYERS_DEFAULT_VALUE = null
export const MIN_PLAYERS_START_VALUE = ''

export type TeamParticipantsSpecDto = z.infer<typeof TeamParticipantsSchema>

export const createTeamParticipantsSpecSchema = (config: TeamParticipantsSpecSchemaDto, t: Translate) => {
  const { min: configMinTeams, max: configMaxTeams } = config.teams
  const { min: configMinPlayersPerTeam, max: configMaxPlayersPerTeam } = config.playersPerTeam

  const absoluteMinPlayers = configMinTeams * configMinPlayersPerTeam

  return TeamParticipantsSchema.superRefine((val, ctx) => {
    const { minTeams, maxTeams, playersPerTeam, minPlayers } = val

    if (minTeams < configMinTeams || minTeams > configMaxTeams) {
      ctx.addIssue({
        code: 'custom',
        message: t('team_participants_min_teams_invalid_range_message_title',
          { min: configMinTeams, max: configMaxTeams }),
        path: ['minTeams'],
      })
    }

    if (maxTeams < configMinTeams || maxTeams > configMaxTeams) {
      ctx.addIssue({
        code: 'custom',
        message: t('team_participants_max_teams_invalid_range_message_title',
          { min: configMinTeams, max: configMaxTeams }),
        path: ['maxTeams'],
      })
    }

    if (maxTeams < minTeams) {
      ctx.addIssue({
        code: 'custom',
        message: t('team_participants_invalid_max_teams_message_title'),
        path: ['maxTeams'],
      })
    }

    if (playersPerTeam < configMinPlayersPerTeam || playersPerTeam > configMaxPlayersPerTeam) {
      ctx.addIssue({
        code: 'custom',
        message: t('team_participants_players_per_team_invalid_range_message_title',
          { min: configMinPlayersPerTeam, max: configMaxPlayersPerTeam }),
        path: ['playersPerTeam'],
      })
    }

    if (minPlayers) {
      const requiredToFillMinTeams = minTeams * playersPerTeam

      if (minPlayers > requiredToFillMinTeams) {
        ctx.addIssue({
          code: 'custom',
          message: t('team_participants_min_players_exceeds_min_teams_capacity',
            { min: absoluteMinPlayers, max: requiredToFillMinTeams }),
          path: ['minPlayers'],
        })
      }

      if (minPlayers < absoluteMinPlayers) {
        ctx.addIssue({
          code: 'custom',
          message: t('team_participants_min_players_absolute_min_message_title', { min: absoluteMinPlayers }),
          path: ['minPlayers'],
        })
      }
    }
  })
}

export const createTeamParticipantsSpecDefaultValue = (config: TeamParticipantsSpecSchemaDto) => {
  return {
    minTeams: config.defaultTeams,
    maxTeams: config.defaultTeams,
    playersPerTeam: config.defaultPlayersPerTeam,
    minPlayers: MIN_PLAYERS_DEFAULT_VALUE,
  }
}

export const formatTeamParticipantsSpecData = (data: TeamParticipantsSpecDto, t: Translate): Array<string> => {
  const { minTeams, maxTeams, playersPerTeam, minPlayers } = data

  const values: Array<string> = []

  if (minTeams === maxTeams) {
    values.push(t('team_participants_point_teams_summary_title', { teams: minTeams, playersPerTeam }))
  } else {
    values.push(t('team_participants_range_teams_summary_title', { minTeams, maxTeams }))
  }

  values.push(t('team_participants_players_per_team_summary_title', { playersPerTeam }))

  if (minPlayers && minPlayers > 0) {
    values.push(t('team_participants_min_players_summary_title', { minPlayers }))
  }

  return values
}

export const buildTeamParticipantsSpecPayload = (data: TeamParticipantsSpecDto) => {
  const payload: Record<string, number> = {
    minTeams: data.minTeams,
    maxTeams: data.maxTeams,
    playersPerTeam: data.playersPerTeam,
  }

  if (data.minPlayers) {
    payload.minPlayers = data.minPlayers
  }

  return payload
}
