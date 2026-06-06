import InfiniteScroll from 'react-infinite-scroll-component'
import useTranslation from 'next-translate/useTranslation'
import { Loader2 } from 'lucide-react'
import { ActivityCard } from '~/components/Activity/ActivityCard'
import { ActivityListItemDto } from '~/types/activity/dto/GetActivitiesResponseDto'

interface InfiniteActivitiesListProps {
  items: Array<ActivityListItemDto>
  total: number
  hasMore: boolean
  loadNextPage: () => void
}

export const InfiniteActivitiesList = ({
  items,
  total,
  hasMore,
  loadNextPage,
}: InfiniteActivitiesListProps) => {
  const { t } = useTranslation('activities')

  if (items.length === 0) {
    return null
  }

  return (
    <InfiniteScroll
      scrollThreshold={ 1 }
      dataLength={ items.length }
      next={ loadNextPage }
      hasMore={ hasMore }
      loader={
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center py-2 overflow-hidden">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      }
      endMessage={
        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8 text-gray-500 font-medium w-full">
          { t('activities_infinite_list_finish_title',{ total }) }
        </div>
      }
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 !overflow-visible"
      style={ { overflow: 'visible' } }
    >
      { items.map((item) => (
        <ActivityCard key={ item.id } activity={ item } />
      )) }
    </InfiniteScroll>
  )
}
