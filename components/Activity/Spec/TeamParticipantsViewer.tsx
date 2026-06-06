import useTranslation from 'next-translate/useTranslation'
import { cn } from '~/lib/utils'
import { ShieldIcon } from 'lucide-react'
import { TeamParticipantsSpecDto } from '~/types/activity/dto/config/spec/SpecDto'

interface TeamParticipantsViewerProps {
  spec: TeamParticipantsSpecDto
}

export const TeamParticipantsViewer = ({ spec }: TeamParticipantsViewerProps) => {
  const { t } = useTranslation('activities')
  const { minPlayers, minTeams, maxTeams, playersPerTeam } = spec.data

  const isTeamsExact = minTeams === maxTeams

  return (
    <div className={ cn(
      'flex flex-col gap-4 p-4 bg-card border rounded-xl shadow-sm',
      'transition-all hover:shadow-md md:col-span-2'
    ) }>
      <div className="flex items-center gap-2.5 border-b pb-2">
        <div className="p-2 bg-secondary/50 rounded-lg shrink-0">
          <ShieldIcon className="w-5 h-5 text-purple-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">
            { t('activity_details_specs_team_participants_title') }
          </span>
          <span className="text-sm font-medium text-foreground">
            { t('activity_details_specs_team_participants_modality_title') }
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-secondary/40 p-3 rounded-lg border border-border/50 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase mb-1">
            { t('activity_details_specs_team_participants_teams_number_title') }
          </span>
          <span className="text-base font-bold text-foreground">
            { isTeamsExact
              ? t('activity_details_specs_team_participants_exact_team_count_title', { count: maxTeams })
              : t('activity_details_specs_team_participants_min_max_team_count_title', { min: minTeams, max: maxTeams })
            }
          </span>
        </div>

        <div className="bg-secondary/40 p-3 rounded-lg border border-border/50 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase mb-1">
            { t('activity_details_specs_team_participants_players_per_team_title') }
          </span>
          <span className="text-base font-bold text-foreground">
            { t('activity_details_specs_team_participants_players_per_team_count_title', { count: playersPerTeam }) }
          </span>
        </div>

        <div className="bg-secondary/40 p-3 rounded-lg border border-border/50 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase mb-1">
            { t('activity_details_specs_team_participants_min_players_title') }
          </span>
          <span className="text-base font-bold text-foreground text-purple-700 dark:text-purple-400">
            { t('activity_details_specs_team_participants_min_players_count_title', { count: minPlayers }) }
          </span>
        </div>
      </div>
    </div>
  )
}
