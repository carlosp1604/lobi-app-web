'use client'

import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'sonner'
import { AppLoader } from '~/components/AppLoader'
import { useAuth } from '~/hooks/useAuth'
import { Separator } from '~/components/ui/separator'
import { useRouter } from 'next/router'
import { ActivityHeader } from '~/components/Activity/ActivityHeader'
import { ActivityService } from '~/services/activitity/ActivityService'
import { ActivitySpecDto } from '~/types/activity/dto/config/spec/SpecDto'
import { useInformationModal } from '~/hooks/useInformationModal'
import { UNAUTHORIZED_ACCESS } from '~/types/shared/ApiCodes'
import { ActivityCapabilityDto } from '~/types/activity/dto/config/capability/CapabilityDto'
import { GetActivityResponseDto } from '~/types/activity/dto/GetActivityResponseDto'
import { useEffect, useRef, useState } from 'react'
import {
  CANCEL_ACTIVITY_ACTIVITY_NOT_FOUND,
  JOIN_ACTIVITY_ACTIVITY_NOT_FOUND,
  LEAVE_ACTIVITY_ACTIVITY_NOT_FOUND,
  LEAVE_ACTIVITY_USER_IS_NOT_A_PARTICIPANT
} from '~/types/activity/ApiCodes'

const ActivitySpecs = dynamic(
  () => import('~/components/Activity/ActivitySpecs').then((module) => module.ActivitySpecs),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center">
        <AppLoader />
      </div>
    ),
  }
)

const ActivityCapabilities = dynamic(
  () => import('~/components/Activity/ActivityCapabilities').then((module) => module.ActivityCapabilities),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center">
        <AppLoader />
      </div>
    ),
  }
)

export interface ActivityDetailsProps {
  activityData: GetActivityResponseDto
}

export const ActivityDetails = ({ activityData }: ActivityDetailsProps) => {
  const router = useRouter()
  const { status, user, setLoginOpen } = useAuth()
  const { t } = useTranslation('activities')
  const { showModal } = useInformationModal()

  const prevAuthStatusRef = useRef(status)

  const [loading, setLoading] = useState(false)

  const { activity, host, sport, isHost, isParticipant, participation } = activityData

  useEffect(() => {
    if (prevAuthStatusRef.current === 'unauthenticated' && status === 'authenticated') {
      void router.replace(router.asPath, undefined, { scroll: false })
    }
    else if (prevAuthStatusRef.current === 'authenticated' && status === 'unauthenticated') {
      void router.replace(router.asPath, undefined, { scroll: false })
    }

    if (status !== 'loading') {
      prevAuthStatusRef.current = status
    }
  }, [status, router])

  const onJoin = async () => {
    if (!user || status !== 'authenticated') {
      toast.warning(t('common:login_to_perform_operation_title'))
      setLoginOpen(true)

      return
    }

    setLoading(true)
    const activityService = new ActivityService()
    const response = await activityService.joinActivity(activity.id)

    setLoading(false)

    if (response.success) {
      await router.replace(router.asPath, undefined, { scroll: false })
      toast.success(t('activity_details_successful_join_title_message'))

      return
    }

    const error = response.error

    if (error.isApiErrorType(JOIN_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      toast.warning(t(error.getTranslationKey()))
      await router.replace('/')

      return
    }

    if (error.isApiErrorType(UNAUTHORIZED_ACCESS)) {
      toast.warning(t(error.getTranslationKey()))
      await router.replace(router.asPath, undefined, { scroll: false })

      return
    }

    showModal({
      title: t('activity_details_join_error_title_message'),
      description: t(error.getTranslationKey()),
      level: 'error',
    })

    await router.replace(router.asPath, undefined, { scroll: false })
  }

  const onLeave = async () => {
    if (!user || status !== 'authenticated') {
      toast.warning(t('common:login_to_perform_operation_title'))
      setLoginOpen(true)

      return
    }

    setLoading(true)
    const activityService = new ActivityService()
    const response = await activityService.leaveActivity(activity.id)

    setLoading(false)

    if (response.success) {
      await router.replace(router.asPath, undefined, { scroll: false })
      toast.success(t('activity_details_successful_leave_title_message'))

      return
    }

    const error = response.error

    if (error.isApiErrorType(LEAVE_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      toast.warning(t(error.getTranslationKey()))
      await router.replace('/')

      return
    }

    if (error.isApiErrorType(UNAUTHORIZED_ACCESS) || error.isApiErrorType(LEAVE_ACTIVITY_USER_IS_NOT_A_PARTICIPANT)) {
      toast.warning(t(error.getTranslationKey()))
      await router.replace(router.asPath, undefined, { scroll: false })

      return
    }

    showModal({
      title: t('activity_details_leave_error_title_message'),
      description: t(error.getTranslationKey()),
      level: 'error',
    })

    await router.replace(router.asPath, undefined, { scroll: false })
  }

  const onCancel = async () => {
    if (!user || status !== 'authenticated') {
      toast.warning(t('common:login_to_perform_operation_title'))
      setLoginOpen(true)

      return
    }

    setLoading(true)
    const activityService = new ActivityService()
    const response = await activityService.cancelActivity(activity.id)

    setLoading(false)

    if (response.success) {
      await router.replace(router.asPath, undefined, { scroll: false })
      toast.success(t('activity_details_successful_cancelled_title_message'))

      return
    }

    const error = response.error

    if (error.isApiErrorType(CANCEL_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      toast.warning(t(error.getTranslationKey()))
      await router.replace('/')

      return
    }

    if (error.isApiErrorType(UNAUTHORIZED_ACCESS)) {
      toast.warning(t(error.getTranslationKey()))
      await router.replace(router.asPath, undefined, { scroll: false })

      return
    }

    showModal({
      title: t('activity_details_cancel_error_title_message'),
      description: t(error.getTranslationKey()),
      level: 'error',
    })

    await router.replace(router.asPath, undefined, { scroll: false })
  }

  const specs = activity.activityConfig.specs as Record<string, ActivitySpecDto>
  const capabilities = activity.activityConfig.capabilities as Record<string, ActivityCapabilityDto>

  return (
    <div className="max-w-2xl w-full mx-auto p-4 space-y-6">
      <ActivityHeader
        activity={ activity }
        participation={ participation }
        sport={ sport }
        host={ host }
        isHost={ isHost }
        isParticipant={ isParticipant }
        onJoin={ onJoin }
        onLeave={ onLeave }
        onCancel={ onCancel }
        loading={ loading }
      />

      <Separator/>

      <ActivitySpecs specs={ specs }/>

      <Separator/>

      <ActivityCapabilities capabilities={ capabilities }/>
    </div>
  )
}
