'use client'

import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Progress } from '~/components/ui/progress'
import { Field, FieldLabel } from '~/components/ui/field'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
  joinableStatuses,
  leaveableStatuses,
  manageableStatuses,
  participableStatuses,
  statusColorMap, statusProgressColorMap
} from '~/types/activity/ActivityStatus'
import {
  ActivityDetailsDto,
  ActivityHostDto,
  ActivityParticipationDto,
  SportDto
} from '~/types/activity/dto/GetActivityResponseDto'
import { cn } from '~/lib/utils'

export interface ActivityHeaderProps {
  activity: ActivityDetailsDto
  sport: SportDto
  host: ActivityHostDto | null
  participation: ActivityParticipationDto | null
  isHost: boolean
  isParticipant: boolean
  onJoin: () => Promise<void>
  onCancel: () => Promise<void>
  onLeave: () => Promise<void>
  loading: boolean
}

export const ActivityHeader = ({
  activity,
  sport,
  host,
  participation,
  isHost,
  isParticipant,
  onJoin,
  onCancel,
  onLeave,
  loading,
}: ActivityHeaderProps) => {
  const { t, lang } = useTranslation('activities')

  const dateFormatter = new Intl.DateTimeFormat(lang, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const formattedDate = dateFormatter.format(new Date(activity.scheduledAt))
  const formattedJoinedDate = participation?.joinedAt
    ? dateFormatter.format(new Date(participation.joinedAt))
    : ''

  const progressValue = (activity.currentParticipants / activity.capacity.max) * 100

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b pb-6">
        <div className="space-y-3.5 flex-1 w-full">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="uppercase px-3 py-3">
              { t(`sports_${sport.slug}_title`) }
            </Badge>

            <Badge className={ `uppercase px-3 py-3 font-bold ${statusColorMap[activity.status]} border-none` }>
              { t(`activity_details_status_${activity.status}_title`) }
            </Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-none">
            { activity.title }
          </h1>
          <div className="space-y-1">
            <div className="font-semibold text-foreground capitalize">
              { formattedDate }
            </div>

            <div className="text-muted-foreground">
              <span className="mr-1">{ t('activity_details_organized_by_title') }</span>
              { host ? (
                <Link
                  href={ `/users/${host.username}` }
                  className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
                >
                  { host.name }
                </Link>
              ) : (
                <span className="font-medium italic text-muted-foreground/70">
                  { t('activity_details_deleted_user_title') }
                </span>
              ) }
            </div>
          </div>

          <div className="pt-1">
            <Field>
              <FieldLabel
                htmlFor="progress-participants"
                className="text-base text-muted-foreground flex justify-between font-normal"
              >
                <span>
                  { t('activity_details_participants_title') }
                </span>
                <span className="font-semibold text-foreground">
                  { `${activity.currentParticipants} / ${activity.capacity.max}` }
                </span>
              </FieldLabel>
              <Progress
                value={ progressValue }
                id="progress-participants"
                className={ cn(
                  'h-2 bg-muted rounded-lg',
                  `[&>div]:${statusProgressColorMap[activity.status]}`
                ) }
              />
            </Field>

            { activity.capacity.min !== activity.capacity.max && (
              <p className="text-muted-foreground mt-1.5">
                { t('activity_details_min_participants_title', { count: activity.capacity.min }) }
              </p>
            ) }
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            { activity.levels.map((level) => (
              <Badge
                key={ level.id }
                variant="outline"
                className="p-3 uppercase bg-muted"
              >
                { t(`ranking_capability_${level.slug}_title`) }
              </Badge>
            )) }
          </div>

        </div>

        <div className="shrink-0 w-full md:w-auto flex flex-col gap-2 md:mt-1">
          { isHost && manageableStatuses.includes(activity.status) && (
            <Button
              variant="destructive"
              className="w-full md:w-32 font-medium"
              onClick={ onCancel }
              disabled={ loading }
            >
              { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/> }
              { !loading && t('activity_details_action_cancel_activity_button_title') }
            </Button>
          ) }

          { isParticipant && leaveableStatuses.includes(activity.status) && (
            <Button
              variant="outline"
              className="w-full md:w-32 font-medium"
              onClick={ onLeave }
              disabled={ loading }
            >
              { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/> }
              { !loading && t('activity_details_action_leave_activity_button_title') }
            </Button>
          ) }

          { !isHost && !isParticipant && joinableStatuses.includes(activity.status) && (
            <Button
              className="w-full md:w-32 font-medium"
              onClick={ onJoin }
              disabled={ loading }
            >
              { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/> }
              { !loading && t('activity_details_action_join_activity_button_title') }
            </Button>
          ) }
        </div>
      </header>

      { isParticipant && participation && !isHost && participableStatuses.includes(activity.status) && (
        <Alert className={ `border-l-4 ${statusColorMap[activity.status]}` }>
          <CheckCircle2 className="w-4 h-4" />
          <AlertTitle className="font-semibold">
            { t(`activity_details_${activity.status}_participation_title`) }
          </AlertTitle>
          <AlertDescription>
            { t(`activity_details_${activity.status}_participation_description`, { date: formattedJoinedDate }) }
          </AlertDescription>
        </Alert>
      ) }

      <section className="space-y-2">
        <h2 className="font-semibold tracking-tight">
          { t('activity_details_description_title') }
        </h2>
        { activity.description ? (
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            { activity.description }
          </p>
        ) : (
          <p className="text-muted-foreground italic text-sm">
            { t('activity_details_no_description_title') }
          </p>
        ) }
      </section>
    </div>
  )
}
