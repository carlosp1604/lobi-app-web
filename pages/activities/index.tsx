import { ActivityService } from '~/services/activitity/ActivityService'
import { SearchActivities } from '~/components/Activity/SearchActivities'
import { GetServerSideProps } from 'next'
import { GetActivitiesResponseDto } from '~/types/activity/dto/GetActivitiesResponseDto'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { GetActivitiesAllowedParams } from '~/types/activity/GetActivitiesAllowedParams'
import { GET_ACTIVITIES_INVALID_PARAMS } from '~/types/activity/ApiCodes'
import { AlertCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

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
  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-4 text-center mt-6 mx-auto max-w-4xl">
        <div className="bg-red-100 p-4 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-red-500"/>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
          Vaya, algo no ha salido bien
        </h1>

        <p className="text-gray-500 max-w-md mx-auto mb-8 text-base md:text-lg">
          Hemos tenido un problema al intentar cargar los resultados. No te preocupes, puedes volver a intentarlo o
          regresar al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button
            asChild
            className="h-12 px-8 text-base font-bold bg-brand-primary hover:bg-brand-primary/80 text-white"
          >
            <Link href="/activities/">
              Volver a buscar
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 px-8 text-base font-bold text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            <Link href="/">
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SearchActivities
      activitiesPage={ activitiesPage }
      sports={ sports }
    />
  )
}
