import useTranslation from "next-translate/useTranslation";
import { useAuth } from "~/hooks/useAuth";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/router";
import { ActivityHeader } from "~/components/Activity/ActivityHeader";
import { ActivitySpecs } from "~/components/ActivitySpecs";
import { ActivitySpecDto } from "~/types/activity/dto/config/spec/SpecDto";
import { ActivityCapabilities } from "~/components/Activity/ActivityCapabilities";
import { ActivityCapabilityDto } from "~/types/activity/dto/config/capability/CapabilityDto";
import { useEffect, useRef, useState } from "react";
import { GetActivityResponseDto, ActivityParticipationDto } from "~/types/activity/dto/GetActivityResponseDto";
import { useInformationModal } from "~/hooks/useInformationModal";
import { ActivityService } from "~/services/activitity/ActivityService";
import { toast } from "sonner";
import {
  CANCEL_ACTIVITY_ACTIVITY_NOT_FOUND,
  JOIN_ACTIVITY_ACTIVITY_NOT_FOUND,
  LEAVE_ACTIVITY_ACTIVITY_NOT_FOUND,
  LEAVE_ACTIVITY_USER_IS_NOT_A_PARTICIPANT
} from "~/types/activity/ApiCodes";
import { UNAUTHORIZED_ACCESS } from "~/types/shared/ApiCodes";

export interface ActivityDetailsProps {
  activityData: GetActivityResponseDto
}

export const ActivityDetails = ({ activityData }: ActivityDetailsProps) => {
  const router = useRouter();
  const { status, user, setLoginOpen } = useAuth();

  const { t } = useTranslation('activities');

  const prevAuthStatus = useRef(status);

  const { activity, host, sport, isHost, isParticipant, participation } = activityData;

  const { showModal } = useInformationModal()

  const [loading, setLoading] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(activity.currentParticipants);
  const [localIsParticipant, setLocalIsParticipant] = useState(isParticipant);
  const [localIsHost, setLocalIsHost] = useState(isHost);
  const [localParticipation, setLocalParticipation] = useState<ActivityParticipationDto | null>(participation);

  const cleanContext = () => {
    setLocalIsHost(false);
    setLocalIsParticipant(false);
    setLocalParticipation(null);
  };

  useEffect(() => {
    if (prevAuthStatus.current === 'unauthenticated' && status === 'authenticated') {
      router.replace(router.asPath, undefined, { scroll: false }).then();
    }
    else if (prevAuthStatus.current === 'authenticated' && status === 'unauthenticated') {
      cleanContext();
    }

    prevAuthStatus.current = status;
  }, [status, router]);

  const onJoin = async () => {
    if (!user || status !== "authenticated") {
      toast.warning(t('common:login_to_perform_operation_title'))
      setLoginOpen(true);

      return;
    }

    setLoading(true);

    const activityService = new ActivityService();
    const response = await activityService.joinActivity(activityData.activity.id);

    setLoading(false);

    if (response.success) {
      setLocalParticipants((prev) => prev + 1);
      setLocalIsParticipant(true);
      setLocalParticipation({
        id: 'temp-participation-uuid',
        userId: user ? user.id : '',
        joinedAt: new Date().toISOString()
      });

      toast.success(t('activity_details_successful_join_title_message'))

      return
    }

    const error = response.error

    if (error.isApiErrorType(JOIN_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      toast.warning(t(error.getTranslationKey()));

      await router.replace("/");
      return;
    }

    if (error.isApiErrorType(UNAUTHORIZED_ACCESS)) {
      toast.warning(t(error.getTranslationKey()));

      cleanContext();
      return;
    }

    showModal({
      title: t('activity_details_join_error_title_message'),
      description: t(error.getTranslationKey()),
      level: 'error'
    })

    await router.replace(router.asPath, undefined, { scroll: false });
  };

  const onLeave = async () => {
    if (!user || status !== "authenticated") {
      toast.warning(t('common:login_to_perform_operation_title'))
      setLoginOpen(true);

      return;
    }

    setLoading(true);

    const activityService = new ActivityService();
    const response = await activityService.leaveActivity(activityData.activity.id);

    setLoading(false);

    if (response.success) {
      const wasHost = localIsHost
      setLocalParticipants((prev) => Math.max(0, prev - 1));
      setLocalIsParticipant(false);
      setLocalIsHost(false);
      setLocalParticipation(null);

      if (wasHost) {
        await router.replace(router.asPath, undefined, { scroll: false })
      }

      toast.success(t('activity_details_successful_leave_title_message'))

      return
    }

    const error = response.error

    if (error.isApiErrorType(LEAVE_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      toast.warning(t(error.getTranslationKey()));

      await router.replace("/");
      return;
    }

    if (error.isApiErrorType(UNAUTHORIZED_ACCESS)) {
      toast.warning(t(error.getTranslationKey()));

      cleanContext();
      return;
    }

    if (error.isApiErrorType(LEAVE_ACTIVITY_USER_IS_NOT_A_PARTICIPANT)) {
      setLocalParticipants((prev) => Math.max(0, prev - 1));
      cleanContext();

      toast.success(t('activity_details_successful_leave_title_message'));
      await router.replace(router.asPath, undefined, { scroll: false });

      return;
    }

    showModal({
      title: t('activity_details_leave_error_title_message'),
      description: t(error.getTranslationKey()),
      level: 'error'
    });

    await router.replace(router.asPath, undefined, { scroll: false });
  };

  const onCancel = async () => {
    if (!user || status !== "authenticated") {
      toast.warning(t('common:login_to_perform_operation_title'))
      setLoginOpen(true);

      return;
    }

    setLoading(true);

    const activityService = new ActivityService();
    const response = await activityService.cancelActivity(activityData.activity.id);

    setLoading(false);

    if (response.success) {
      await router.replace(router.asPath, undefined, { scroll: false })

      toast.success(t('activity_details_successful_cancelled_title_message'))

      return
    }

    const error = response.error

    if (error.isApiErrorType(CANCEL_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      toast.warning(t(error.getTranslationKey()));

      await router.replace("/");
      return;
    }

    if (error.isApiErrorType(UNAUTHORIZED_ACCESS)) {
      toast.warning(t(error.getTranslationKey()));

      cleanContext();
      return;
    }

    showModal({
      title: t('activity_details_cancel_error_title_message'),
      description: t(error.getTranslationKey()),
      level: 'error'
    });

    await router.replace(router.asPath, undefined, { scroll: false });
  };

  const dynamicActivity = {
    ...activity,
    currentParticipants: localParticipants,
  };

  const specs = activity.activityConfig.specs as Record<string, ActivitySpecDto>
  const capabilities = activity.activityConfig.capabilities as Record<string, ActivityCapabilityDto>

  return (
    <div className="max-w-2xl w-full mx-auto p-4 space-y-8">
      <ActivityHeader
        activity={dynamicActivity}
        participation={localParticipation}
        sport={sport}
        host={host}
        isHost={localIsHost}
        isParticipant={localIsParticipant}
        onJoin={onJoin}
        onLeave={onLeave}
        onCancel={onCancel}
        loading={loading}
      />

      <Separator/>

      <ActivitySpecs specs={specs}/>

      <Separator/>

      <ActivityCapabilities capabilities={capabilities}/>
    </div>
  )
}
