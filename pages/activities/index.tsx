import useTranslation from 'next-translate/useTranslation'
import { Seo } from '~/components/Seo'
import { ActivitiesError } from '~/components/ActivitesError'
import { ActivityService } from '~/services/activitity/ActivityService'
import { SearchActivities } from '~/components/Activity/SearchActivities'
import { GetServerSideProps } from 'next'
import { GetActivitiesResponseDto } from '~/types/activity/dto/GetActivitiesResponseDto'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { GetActivitiesAllowedParams } from '~/types/activity/GetActivitiesAllowedParams'
import { GET_ACTIVITIES_INVALID_PARAMS } from '~/types/activity/ApiCodes'

export interface ActivitiesPageProps {
  activitiesPage: GetActivitiesResponseDto | null
  sports: GetSportsQueryResponseDto
  isError: boolean
}

export const getServerSideProps = (async (context) => {
  const activityService = new ActivityService()
  const getSportsResult = await activityService.getSports()

  if (!getSportsResult.success) {
    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    }
  }

  const sports = getSportsResult.value

  const query = context.query
  const queryKeys = Object.keys(query)

  if (queryKeys.length === 0) {
    return {
      props: {
        activitiesPage: null,
        isError: false,
        sports,
      },
    }
  }

  const cleanQuery: Record<string, string | string[]> = {}
  let hasGarbage = false

  for (const key of queryKeys) {
    if (GetActivitiesAllowedParams.includes(key)) {
      cleanQuery[key] = query[key]!
    } else {
      hasGarbage = true
    }
  }

  if (hasGarbage) {
    const searchParams = new URLSearchParams()

    Object.entries(cleanQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((currentValue) => searchParams.append(key, currentValue))
      } else {
        searchParams.set(key, value as string)
      }
    })

    const basePath = context.resolvedUrl.split('?')[0]
    const pathWithSlash = basePath.endsWith('/') ? basePath : `${basePath}/`

    const queryString = searchParams.toString()
    const destination = queryString ? `${pathWithSlash}?${queryString}` : pathWithSlash

    return {
      redirect: {
        destination,
        permanent: false,
      },
    }
  }

  const cookieHeader = context.req.headers.cookie || ''

  const result = await activityService.getActivities(cleanQuery, {
    headers: {
      'Cookie': cookieHeader,
    },
  })

  if (!result.success) {
    const error = result.error

    if (error.isApiErrorType(GET_ACTIVITIES_INVALID_PARAMS)) {
      return {
        props: {
          activitiesPage: null,
          isError: true,
          sports,
        },
      }
    }

    return {
      redirect: {
        destination: '/500/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      activitiesPage: result.value,
      isError: false,
      sports,
    },
  }
}) satisfies GetServerSideProps<ActivitiesPageProps>

export default function ActivitiesPage({ activitiesPage, sports, isError }: ActivitiesPageProps) {
  const { t } = useTranslation('activities')

  const canonical = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/activities/`

  if (isError) {
    return (
      <>
        <Seo
          title={ t('activities_error_page_title') }
          description={ t('activities_error_page_description')  }
          canonicalUrl={ canonical }
          noIndex={ true }
        />

        <ActivitiesError />
      </>

    )
  }

  const hasPage = activitiesPage !== null

  return (
    <>
      <Seo
        title={ t('activities_search_page_title') }
        description={ t('activities_search_page_description')  }
        canonicalUrl={ canonical }
        noIndex={ hasPage }
        jsonLd={ {
          '@context': 'https://schema.org',
          '@type': 'SearchResultsPage',
          'name': 'Buscador de actividades deportivas',
          'url': `${process.env.NEXT_PUBLIC_APP_BASE_URL}/activities/`,
          'description': t('activities_search_page_description'),
        } }
      />

      <SearchActivities
        activitiesPage={ activitiesPage }
        sports={ sports }
      />
    </>
  )
}
