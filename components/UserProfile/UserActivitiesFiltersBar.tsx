import useTranslation from 'next-translate/useTranslation'
import { Button } from '~/components/ui/button'
import { allStatuses, ValidActivityStatus } from '~/types/activity/ActivityStatus'
import { ChevronDown } from 'lucide-react'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { StringArrayFilterSchemaDto, UUIDFilterSchemaDto } from '~/types/activity/dto/GetActivitiesResponseDto'
import { GetActivitiesSortByOption, GetActivitiesSortDirectionOption } from '~/types/activity/GetActivitiesAllowedParams'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'

export interface UserActivitiesFiltersState {
  participantId: UUIDFilterSchemaDto | null
  hostId: UUIDFilterSchemaDto | null
  statuses: StringArrayFilterSchemaDto
  sportId: UUIDFilterSchemaDto | null
  sortBy: GetActivitiesSortByOption
  sortDirection: GetActivitiesSortDirectionOption
}

interface UserActivitiesFiltersBarProps {
  userId: string
  sports: GetSportsQueryResponseDto | null
  filters: UserActivitiesFiltersState
  onChange: <K extends keyof UserActivitiesFiltersState>(field: K, value: UserActivitiesFiltersState[K]) => void
  onSearch: () => void
  loading: boolean
}

const allSportsKey = 'any-sport-id'

export const UserActivitiesFiltersBar = ({
  userId,
  sports,
  filters,
  onChange,
  onSearch,
  loading,
}: UserActivitiesFiltersBarProps) => {
  const { t } = useTranslation('user')

  const currentRole = (filters.hostId && filters.participantId)
    ? 'both'
    : filters.hostId
      ? 'host'
      : 'participant'

  const handleRoleChange = (value: string) => {
    if (value === 'both') {
      onChange('hostId', userId)
      onChange('participantId', userId)
    } else if (value === 'host') {
      onChange('hostId', userId)
      onChange('participantId', null)
    } else {
      onChange('hostId', null)
      onChange('participantId', userId)
    }
  }

  const handleStatusChange = (status: ValidActivityStatus, checked: boolean) => {
    if (checked) {
      onChange('statuses', [...filters.statuses, status])
    } else {
      if (filters.statuses.length === 1) {
        return
      }
      onChange('statuses', filters.statuses.filter(s => s !== status))
    }
  }

  const pillClasses = 'bg-background h-10 px-3 md:px-4 tracking-tight text-sm font-medium hover:bg-gray-100 ' +
    'flex items-center justify-between gap-2 whitespace-nowrap transition-colors focus:outline-none cursor-pointer'

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
      <div
        className="grid grid-cols-2 gap-[1px] justify-around overflow-x-auto md:grid-cols-4
          w-full scrollbar-hide rounded-2xl border-2 bg-border"
      >
        <DropdownMenu>
          <DropdownMenuTrigger className={ pillClasses } disabled={ loading }>
            { t('user_activities_filters_bar_role_dropdown_button_title',
              { type: t(`user_activities_filters_bar_role_${currentRole}_role_title`) }
            ) }
            <ChevronDown className="w-4 h-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuRadioGroup value={ currentRole } onValueChange={ handleRoleChange }>
              <DropdownMenuRadioItem value="both">
                { t('user_activities_filters_bar_role_both_role_title') }
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="host">
                { t('user_activities_filters_bar_role_host_role_title') }
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="participant">
                { t('user_activities_filters_bar_role_participant_role_title') }
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className={ pillClasses } disabled={ loading }>
            <span className="truncate max-w-[120px]">
              { filters.sportId && sports
                ? t(`activities:sports_${sports.sports.find(sport => sport.id === filters.sportId)?.slug}_title`)
                : t('user_activities_filters_bar_sport_dropdown_any_sport_title') }
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </DropdownMenuTrigger>
          { sports && (
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuRadioGroup
                value={ filters.sportId || allSportsKey }
                onValueChange={ (val) => onChange('sportId', val === allSportsKey ? null : val) }
              >
                <DropdownMenuRadioItem value={ allSportsKey }>
                  { t('user_activities_filters_bar_sport_dropdown_any_sport_title') }
                </DropdownMenuRadioItem>
                { sports.sports.map((sport) => (
                  <DropdownMenuRadioItem key={ sport.id } value={ sport.id }>
                    { t(`activities:sports_${sport.slug}_title`) }
                  </DropdownMenuRadioItem>
                )) }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          ) }
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className={ pillClasses } disabled={ loading }>
            <span className="truncate max-w-[120px]">
              { filters.statuses.length === allStatuses.length
                ? t('user_activities_filters_bar_statuses_dropdown_button_title')
                : t('user_activities_filters_bar_statuses_selected_count_title', { count: filters.statuses.length })
              }
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            { allStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                onSelect={ (e) => {e.preventDefault(); e.stopPropagation()} }
                key={ status }
                checked={ filters.statuses.includes(status) }
                onCheckedChange={ (checked) => handleStatusChange(status, checked) }
                disabled={ filters.statuses.length === 1 && filters.statuses.includes(status) }
                className="cursor-pointer"
              >
                { t(`user_activities_filters_bar_statuses_${status}_status_title`) }
              </DropdownMenuCheckboxItem>
            )) }
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className={ pillClasses } disabled={ loading }>
            <span className="truncate">
              { t(`user_activities_filters_bar_sort_${filters.sortBy}_${filters.sortDirection}_option_title`) }
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuRadioGroup
              value={ filters.sortDirection }
              onValueChange={ (value) => {
                onChange('sortBy', 'date')
                onChange('sortDirection', value as GetActivitiesSortDirectionOption)
              } }
            >
              <DropdownMenuRadioItem value="asc">
                { t('user_activities_filters_bar_sort_date_asc_option_title') }
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                { t('user_activities_filters_bar_sort_date_desc_option_title') }
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        onClick={ onSearch }
        disabled={ loading }
        className="w-full sm:w-auto h-10 px-6 font-bold shrink-0"
      >
        { t('user_activities_filters_bar_search_button_title') }
      </Button>
    </div>
  )
}
