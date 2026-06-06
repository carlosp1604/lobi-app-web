'use client'

import useTranslation from 'next-translate/useTranslation'
import { Info } from 'lucide-react'
import { toast } from 'sonner'
import { AppLoader } from '~/components/AppLoader'
import { useAuth } from '~/hooks/useAuth'
import { useRouter } from 'next/router'
import { EmptyState } from '~/components/EmptyState'
import { ActivityService } from '~/services/activitity/ActivityService'
import { ActivityListItemDto } from '~/types/activity/dto/GetActivitiesResponseDto'
import { InfiniteActivitiesList } from '~/components/Activity/InfiniteActivitiesList'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { useEffect, useRef, useState } from 'react'
import { allStatuses, ValidActivityStatus } from '~/types/activity/ActivityStatus'
import { DefaultSortByOption, DefaultSortDirectionOption } from '~/types/activity/GetActivitiesAllowedParams'
import { UserActivitiesFiltersBar, UserActivitiesFiltersState } from '~/components/UserProfile/UserActivitiesFiltersBar'

interface UserActivitiesProps {
  userId: string
  userName: string
}

export const UserActivities = ({ userId, userName }: UserActivitiesProps) => {
  const { t } = useTranslation('user')

  const { status } = useAuth()
  const { replace } = useRouter()
  const prevAuthStatusRef = useRef(status)

  const [items, setItems] = useState<Array<ActivityListItemDto>>([])
  const [total, setTotal] = useState<number>(0)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [sports, setSports] = useState<GetSportsQueryResponseDto | null>(null)

  const [activeFilters, setActiveFilters] = useState<UserActivitiesFiltersState>({
    participantId: userId,
    hostId: userId,
    statuses: allStatuses.filter((status) => status !== ValidActivityStatus.CANCELLED),
    sportId: null,
    sortBy:DefaultSortByOption,
    sortDirection: DefaultSortDirectionOption,
  })

  const [loading, setLoading] = useState(true)

  const resetValues = () => {
    setItems([])
    setTotal(0)
    setHasNext(false)
  }

  const fetchSports = async () => {
    setLoading(true)
    const activityService = new ActivityService()
    const result = await activityService.getSports()

    if (result.success) {
      setSports(result.value)
    } else {
      const error = result.error

      if (!error.isApiError()) {
        toast.error(t(error.getTranslationKey()))
      }
    }

    setLoading(false)
  }

  const fetchNextPage = async (pageToFetch = page) => {
    if (pageToFetch === 1) {
      resetValues()
    }

    setLoading(true)

    const activityService = new ActivityService()
    const filters: Record<string, string | Array<string>> = {
      statuses: activeFilters.statuses,
      sortBy: activeFilters.sortBy,
      sortDirection: activeFilters.sortDirection,
      page: String(pageToFetch),
    }

    if (activeFilters.participantId !== null) {
      filters.participantId = activeFilters.participantId
    }

    if (activeFilters.hostId !== null) {
      filters.hostId = activeFilters.hostId
    }

    if (activeFilters.sportId !== null) {
      filters.sportId = activeFilters.sportId
    }

    const result = await activityService.getUserActivities(filters)

    if (result.success) {
      const { hasNext, items: newItems, total, sort, activeFilters } = result.value

      if (pageToFetch === 1) {
        setItems(newItems)
      } else {
        setItems(prev => [...prev, ...newItems])
      }

      setTotal(total)
      setHasNext(hasNext)
      setActiveFilters({
        participantId: activeFilters.participantId ?? null,
        hostId: activeFilters.hostId ?? null,
        statuses: activeFilters.statuses ?? allStatuses.filter((status) => status !== ValidActivityStatus.CANCELLED),
        sportId: activeFilters.sportId ?? null,
        sortBy: sort.by,
        sortDirection: sort.direction,
      })
    } else {
      const error = result.error

      if (!error.isApiError()) {
        toast.error(t(error.getTranslationKey()))
      }
    }

    setPage(pageToFetch + 1)
    setLoading(false)
  }

  useEffect(() => {
    if (prevAuthStatusRef.current === 'unauthenticated' && status === 'authenticated') {
      void fetchNextPage(1)
    }
    else if (prevAuthStatusRef.current === 'authenticated' && status === 'unauthenticated') {
      void fetchNextPage(1)
    }

    if (status !== 'loading') {
      prevAuthStatusRef.current = status
    }
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [status, replace])

  useEffect(() => {
    fetchSports().then(() => {
      void fetchNextPage()
    })
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [])

  const onChange = <K extends keyof UserActivitiesFiltersState>(
    field: K,
    value: UserActivitiesFiltersState[K]
  ) => {
    setActiveFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6 w-full">
      <UserActivitiesFiltersBar
        userId={ userId }
        filters={ activeFilters }
        sports={ sports }
        onChange={ onChange }
        onSearch={ async () => { await fetchNextPage(1) } }
        loading={ loading }
      />

      { !loading && total > 0 && (
        <div>
          <span className="text-brand-primary font-bold">
            { total }
          </span>
          { t('user_activities_total_activities_title') }
        </div>
      ) }

      { !loading && total === 0 && (
        <EmptyState
          icon={ Info }
          title={ t('user_activities_empty_state_title') }
          description={ t('user_activities_empty_state_description', { userName }) }
        />
      ) }

      { loading && total === 0 && (
        <div className="w-48 h-5 bg-gray-200 animate-pulse rounded-2xl" />
      ) }

      { loading && total === 0 && (
        <div className="flex w-full min-h-[200px] md:min-h-[400px] justify-center">
          <AppLoader title={ t('user_activities_loading_title') }/>
        </div>
      ) }

      <InfiniteActivitiesList
        items={ items }
        total={ total }
        hasMore={ hasNext }
        loadNextPage={ () => fetchNextPage(page) }
      />
    </div>
  )
}
