'use client'

import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Badge } from '~/components/ui/badge'
import { statusColorMap } from '~/types/activity/ActivityStatus'
import { ActivityListItemDto } from '~/types/activity/dto/GetActivitiesResponseDto'
import { CheckCircle2, ShieldIcon, Users } from 'lucide-react'

interface ActivityCardProps {
  activity: ActivityListItemDto
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { t, lang } = useTranslation('activities')

  const {
    id,
    title,
    description,
    status,
    currentParticipants,
    capacity,
    teamConfig,
    sport,
    host,
    isParticipant,
    participation,
    isHost,
  } = activity

  const dateFormatter = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const joinedDateFormatter = new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      href={ `/activities/${id}/` }
      className="group flex flex-col gap-3 border-2 border-border rounded-xl p-4
        shadow-sm hover:shadow-md hover:border-brand-primary/50 transition-all
        cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <Badge className={ `${statusColorMap[status]} px-2 py-3 rounded-full uppercase border-none` }>
          { t(`activity_card_status_${status}_title`) }
        </Badge>
        <Badge className="px-2 py-3 rounded-full uppercase" variant="outline">
          { t(`sports_${sport.slug}_title`) }
        </Badge>
      </div>

      <h3
        className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 group-hover:text-brand-primary transition-colors">
        { title }
      </h3>

      { description ? (
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
          { description }
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic">
          { t('activity_card_no_description_title') }
        </p>
      ) }

      <div className="flex flex-wrap gap-2 mt-auto">
        <div className="flex items-center gap-1.5 text-brand-primary bg-brand-primary/10 px-2.5 py-1.5 rounded-lg text-sm font-medium">
          <Users className="w-4 h-4 text-brand-primary" />
          <span>
            { t('activity_card_participants_count_title', { currentParticipants, max: capacity.max }) }
          </span>
          { capacity.min > 0 && capacity.min !== capacity.max && (
            <span className="ml-1">
              { t('activity_card_participants_min_title', { min: capacity.min }) }
            </span>
          ) }
        </div>

        { teamConfig && (
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-500 px-2.5 py-1.5 rounded-lg text-sm font-medium">
            <ShieldIcon className="w-4 h-4 text-purple-500" />
            <span>
              { t('activity_card_teams_config_title', { count: teamConfig.playersPerTeam }) }
            </span>
          </div>
        ) }
      </div>

      <div className="pt-3 flex justify-between items-center text-sm border-t border-gray-100">
        <span className="text-gray-800 font-semibold capitalize">
          { dateFormatter.format(new Date(activity.scheduledAt)) }
        </span>
        <div className="flex gap-2 items-center">
          <span className="text-sm tracking-wide text-gray-500 font-normal">
            { t('activity_card_organizer_title', { hostName: host ? host.name : t('activity_card_organizer_unknown_title') }) }
          </span>
        </div>
      </div>

      { isParticipant && participation && (
        <div className="mt-1 pt-2 border-t border-gray-50 text-center">
          <span className="text-sm text-brand-primary font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="h-3 w-3"/>
            { isHost && t('activity_card_host_created_at_title', { date: joinedDateFormatter.format(new Date(activity.createdAt)) }) }
            {
              !isHost &&
              t('activity_card_participant_joined_at_title',
                { date: joinedDateFormatter.format(new Date(participation.joinedAt)) })
            }
          </span>
        </div>
      ) }
    </Link>
  )
}
