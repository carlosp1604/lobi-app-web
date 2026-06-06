'use client'

import useTranslation from 'next-translate/useTranslation'
import { useAuth } from '~/hooks/useAuth'
import { useRouter } from 'next/router'
import { TrafficCone } from 'lucide-react'
import { ActivityCard } from '~/components/Activity/ActivityCard'
import { useEffect, useRef } from 'react'
import { ActivitiesFiltersBar } from '~/components/Activity/ActivitiesFiltersBar'
import { ActivitiesPaginationBar } from '~/components/Activity/ActivitiesPaginationBar'
import { GetActivitiesResponseDto } from '~/types/activity/dto/GetActivitiesResponseDto'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'

export interface SearchActivitiesProps {
  activitiesPage: GetActivitiesResponseDto | null
  sports: GetSportsQueryResponseDto
}

export const SearchActivities = ({ activitiesPage, sports }: SearchActivitiesProps) => {
  const { t } = useTranslation('activities')
  const { status } = useAuth()
  const { asPath, replace } = useRouter()

  const prevAuthStatusRef = useRef(status)

  useEffect(() => {
    if (prevAuthStatusRef.current === 'unauthenticated' && status === 'authenticated') {
      void replace(asPath, undefined, { scroll: false })
    }
    else if (prevAuthStatusRef.current === 'authenticated' && status === 'unauthenticated') {
      void replace(asPath, undefined, { scroll: false })
    }

    if (status !== 'loading') {
      prevAuthStatusRef.current = status
    }
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [status, replace])

  const titleDescription = (
    <div className="flex flex-col items-center justify-center py-6 px-4 md:py-10">
      <h1 className="text-center font-black text-3xl md:text-4xl text-gray-900 tracking-tight mb-4">
        { t('activities_search_h1_title') }
      </h1>
      <h2 className="text-center text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
        { t('activities_search_h2_title') }
      </h2>
    </div>
  )

  return (
    <div className="space-y-4 p-4 pt-0">
      <ActivitiesFiltersBar
        key={ asPath }
        sports={ sports }
        activeFilters={ activitiesPage ? activitiesPage.activeFilters : {} }
        sort={ activitiesPage ? activitiesPage.sort : undefined }
      />

      { !activitiesPage && (
        <div className="mt-8">
          { titleDescription }
          <div className="mt-8 text-center text-gray-500 italic">
          </div>
        </div>
      ) }

      { activitiesPage && (
        <div className="mt-6">
          <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
            <h2 className="font-bold text-xl text-gray-800">
              { t('activities_search_activities_count_title', { count: activitiesPage.total }) }
            </h2>
          </div>

          { activitiesPage.total > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                { activitiesPage.items.map((item) => (
                  <ActivityCard key={ item.id } activity={ item }/>
                )) }
              </div>
              <ActivitiesPaginationBar
                pagination={ activitiesPage.pagination }
                total={ activitiesPage.total }
              />
            </>

          ) : (
            <div className="flex flex-col items-center text-center py-16 mt-4">
              <span className="text-4xl mb-4">
                <TrafficCone className="h-12 w-12 text-orange-500"/>
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-10">
                { t('activities_search_empty_state_title') }
              </h3>
              <p className="text-gray-500 max-w-md mx-auto whitespace-pre-wrap">
                { t('activities_search_empty_state_description') }
              </p>
            </div>
          ) }

          <div className="mt-16 border-t border-gray-100 pt-8">
            { titleDescription }
          </div>
        </div>
      ) }
    </div>
  )
}
