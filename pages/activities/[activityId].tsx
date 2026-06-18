import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { ActivityDetails } from '~/components/ActivityDetails'
import { ActivityService } from '~/services/activitity/ActivityService'
import { GetServerSideProps } from 'next'
import { GetActivityResponseDto } from '~/types/activity/dto/GetActivityResponseDto'
import { InformationModalProvider } from '~/context/InformationModalProvider'
import { GET_ACTIVITY_ACTIVITY_NOT_FOUND } from '~/types/activity/ApiCodes'

export interface ActivityPageProps {
  activityData: GetActivityResponseDto
}

export const getServerSideProps = (async (context) =>  {
  const activityId = context.query.activityId

  if (!activityId || Array.isArray(activityId)) {
    return { notFound: true }
  }

  const cookieHeader = context.req.headers.cookie

  const activityService = new ActivityService()
  const result = await activityService.getActivity(activityId, {
    headers: {
      'Cookie': cookieHeader,
    },
  })

  if (!result.success) {
    const error = result.error

    if (error.isApiErrorType(GET_ACTIVITY_ACTIVITY_NOT_FOUND)) {
      return { notFound: true }
    }

    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    }
  }

  const activityData = result.value

  return { props: { activityData } }
}) satisfies GetServerSideProps<ActivityPageProps>

export default function ActivityPage({ activityData }: ActivityPageProps) {
  const { t } = useTranslation('activities')

  if (!activityData) {
    return null
  }

  const sportName = t(`sports_${activityData.sport.slug}_title`)
  const activity = activityData.activity

  const startDate = activity.scheduledAt

  const endDate = activity.duration
    ? new Date(new Date(startDate).getTime() + Number(activity.duration.max.value) * 1000).toISOString()
    : undefined

  return (
    <>
      <Seo
        title={ activity.title }
        description={ t('activity_details_page_description', { sportName }) }
        canonicalUrl={ `${process.env.NEXT_PUBLIC_APP_BASE_URL}/activities/${activity.id}/` }
        noIndex={ false }
        jsonLd={ {
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          'name': activity.title,
          'description': activity.description,
          'startDate': startDate,
          ...(endDate && {
            'endDate': endDate,
          }),
          'sport': sportName,
          ...(activity.duration && {
            'duration': `PT${activity.duration.max.value}S`,
          }),
          ...(activity.location && {
            'location': {
              '@type': 'Place',
              'name': t('activity_details_page_jsonld_location_title'),
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': activity.location.lat,
                'longitude': activity.location.lng,
              },
            },
          }),
          'organizer': {
            '@type': 'Person',
            'name': activityData.host ? activityData.host.name : t('activity_details_page_jsonld_creator_unknown_title'),
          },
        } }
      />
      <InformationModalProvider>
        <ActivityDetails activityData={ activityData } />
      </InformationModalProvider>
    </>
  )
}
