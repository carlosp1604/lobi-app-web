import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { CreateActivity } from '~/components/CreateActivity'
import { ActivityService } from '~/services/activitity/ActivityService'
import { GetServerSideProps } from 'next'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'

export interface CreateActivityPageProps {
  sports: GetSportsQueryResponseDto
}

export const getServerSideProps = (async (_context) =>  {
  const activityService = new ActivityService()
  const result = await activityService.getSports()

  if (!result.success) {
    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    }
  }

  const sports = result.value

  return { props: { sports } }
}) satisfies GetServerSideProps<CreateActivityPageProps>

export default function CreateActivityPage({ sports }: CreateActivityPageProps) {
  const { t } = useTranslation('activities')

  if (!sports) {
    return null
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/activities/create/`

  return (
    <>
      <Seo
        title={ t('create_activity_page_title') }
        description={ t('create_activity_page_description') }
        noIndex={ true }
        canonicalUrl={ canonicalUrl }
      />
      <CreateActivity sports={ sports.sports }/>
    </>
  )
}
