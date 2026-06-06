'use client'

import useTranslation from 'next-translate/useTranslation'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/router'
import { LocationMapModal } from '~/components/Forms/Input/Geographic/LocationMapModal'
import { useMemo, useState } from 'react'
import { GetSportsQueryResponseDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { MultipleChoiceCapabilitySchemaDto } from '~/types/activity/dto/CapabilitySchemaDto'
import { joinableStatuses, ValidActivityStatus } from '~/types/activity/ActivityStatus'
import { DefaultRadiusMeters, RadiusConversionFactor } from '~/types/shared/Location'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover'
import {
  DefaultSortByOption,
  DefaultSortDirectionOption,
  GetActivitiesSortByOption,
  GetActivitiesSortDirectionOption
} from '~/types/activity/GetActivitiesAllowedParams'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
  GeographicFilterSchemaDto,
  GetActivitiesActiveFiltersDto,
  GetActivitiesSortDto,
  IntegerNumericValueFilterSchemaDto,
  NumericValueFilterSchemaDto,
  StringArrayFilterSchemaDto,
  UUIDArrayFilterSchemaDto,
  UUIDFilterSchemaDto
} from '~/types/activity/dto/GetActivitiesResponseDto'
import { CheckCircle2 } from 'lucide-react'

export interface ActivitiesFiltersBarProps {
  sports: GetSportsQueryResponseDto
  activeFilters?: GetActivitiesActiveFiltersDto
  sort?: GetActivitiesSortDto
}

interface ActivitiesFiltersBarState {
  location: GeographicFilterSchemaDto | null
  radius: NumericValueFilterSchemaDto
  maxDateSeconds: IntegerNumericValueFilterSchemaDto | null
  statuses: StringArrayFilterSchemaDto
  sportId: UUIDFilterSchemaDto
  minFreeSlots: IntegerNumericValueFilterSchemaDto | null
  levelIds: UUIDArrayFilterSchemaDto
  sortBy: GetActivitiesSortByOption
  sortDirection: GetActivitiesSortDirectionOption
}

const allSportsKey = 'any-sport-id'
const SlotsOptions = Array.from({ length: 20 }, (_, i) => i + 1)

export const ActivitiesFiltersBar = ({
  sports,
  activeFilters = {},
  sort = undefined,
}: ActivitiesFiltersBarProps) => {
  const router = useRouter()
  const { t } = useTranslation('activities')

  const [isLocationMapOpen, setIsLocationMapOpen] = useState(false)
  const [isSlotsOpen, setIsSlotsOpen] = useState(false)

  const [filters, setFilters] = useState<ActivitiesFiltersBarState>({
    location: activeFilters.location ?? null,
    radius: activeFilters.radius ?? DefaultRadiusMeters,
    sportId: activeFilters.sportId ?? allSportsKey,
    sortBy: sort? sort.by : DefaultSortByOption,
    sortDirection: sort? sort.direction : DefaultSortDirectionOption,
    statuses: activeFilters.statuses ?? joinableStatuses,
    minFreeSlots: activeFilters.minFreeSlots ?? null,
    levelIds: activeFilters.levelIds ?? [],
    maxDateSeconds: activeFilters.maxDateSeconds ?? null,
  })

  const selectedSport = sports.sports.find(sport => sport.id === filters.sportId)

  const availableLevels = useMemo(() => {
    if (!selectedSport) {
      return []
    }

    const hasRankings = selectedSport.config.capabilities.ranking !== undefined

    if (!hasRankings) {
      return []
    }

    return (selectedSport.config.capabilities.ranking as MultipleChoiceCapabilitySchemaDto).options
  }, [selectedSport])

  const hasLevels = availableLevels.length > 0

  const handleChange = <K extends keyof ActivitiesFiltersBarState>(
    field: K,
    value: ActivitiesFiltersBarState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelectChange = (field: 'statuses' | 'levelIds', value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentList = prev[field]

      if (checked) {
        return { ...prev, [field]: [...currentList, value] }
      } else {
        if (field === 'statuses' && currentList.length === 1 && currentList.includes(value as ValidActivityStatus)) {
          return prev
        }

        return { ...prev, [field]: currentList.filter(item => item !== value) }
      }
    })
  }

  const handleSearch = () => {
    const searchParams = new URLSearchParams()

    if (!filters.location) {
      toast.error(t('activities_search_bar_location_missing_error_message_title'))

      return
    }

    searchParams.set('location', `${filters.location.lat},${filters.location.lng}`)

    if (filters.sportId !== allSportsKey) {
      searchParams.set('sportId', filters.sportId)
    }

    if (filters.statuses.length > 0) {
      filters.statuses.forEach((item) => {
        searchParams.append('statuses', item)
      })
    }

    if (filters.levelIds.length > 0) {
      filters.levelIds.forEach((item) => {
        searchParams.append('levelIds', item)
      })
    }

    searchParams.set('radius', String(filters.radius))
    searchParams.set('sortBy', String(filters.sortBy))
    searchParams.set('sortDirection', String(filters.sortDirection))
    searchParams.set('minFreeSlots', String(filters.minFreeSlots))

    const queryString = searchParams.toString()
    const destination = queryString ? `/activities/?${queryString}` : '/activities/'

    void router.push(destination)
  }

  const fieldContainerClasses = 'flex flex-col hover:bg-gray-50 transition-colors w-full text-left ' +
    'focus:outline-none cursor-pointer h-full'
  const labelClasses = 'font-bold text-gray-700 mb-1 pointer-events-none'

  return (
    <div className="tracking-tight overflow-hidden border-2 border-brand-primary w-full flex flex-col rounded-2xl border">
      <LocationMapModal
        initialLocation={ filters.location ?? null }
        isOpen={ isLocationMapOpen }
        title={ t('activities_search_bar_location_map_title') }
        onClose={ () => setIsLocationMapOpen(false) }
        onConfirm={ (location) => {
          handleChange('location', location)
          setIsLocationMapOpen(false)
        } }
        radius={ {
          initialValue: filters.radius/RadiusConversionFactor,
          onChange: (value) => {
            handleChange('radius', value * RadiusConversionFactor)
          },
        } }
      />
      <div className="flex flex-col divide-y divide-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <button
            onClick={ () => setIsLocationMapOpen(true) }
            className={ `${fieldContainerClasses} px-4 py-2 md:col-span-1 text-left items-start` }
          >
            <span className={ labelClasses }>
              { t('activities_search_bar_location_label_title') }
            </span>
            <div className="flex items-center text-gray-500 font-medium w-full justify-between">
              { filters.location
                ? t('activities_search_bar_location_selected_title')
                : t('activities_search_bar_location_placeholder_title')
              }
              { filters.location && (<CheckCircle2 className="text-brand-primary"/>) }
            </div>
          </button>

          <div className={ fieldContainerClasses }>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col w-full h-full text-left focus:outline-none px-4 py-2 cursor-pointer">
                  <span className={ labelClasses }>
                    { t('activities_search_bar_sport_label_title') }
                  </span>
                  <div className="flex items-center justify-between text-gray-500 font-medium w-full">
                    <span className="truncate">
                      { filters.sportId && filters.sportId !== allSportsKey
                        ? t(`sports_${sports.sports.find(s => s.id === filters.sportId)?.slug}_title`)
                        : t('activities_search_bar_sport_any_sport_option_title') }
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-t-none"
                align="start"
                sideOffset={ 0 }
              >
                <DropdownMenuRadioGroup
                  value={ filters.sportId || allSportsKey }
                  onValueChange={ (value) => handleChange('sportId', value) }
                >
                  <DropdownMenuRadioItem
                    value={ allSportsKey }
                    className="py-2 px-4"
                  >
                    { t('activities_search_bar_sport_any_sport_option_title') }
                  </DropdownMenuRadioItem>
                  { sports.sports.map((sport) => (
                    <DropdownMenuRadioItem
                      key={ sport.id }
                      value={ sport.id }
                      className="py-2 px-4">
                      { t(`sports_${sport.slug}_title`) }
                    </DropdownMenuRadioItem>
                  )) }
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Popover open={ isSlotsOpen } onOpenChange={ setIsSlotsOpen }>
            <PopoverTrigger asChild>
              <button className={ `${fieldContainerClasses} px-4 py-2` }>
                <span className={ labelClasses }>
                  { t('activities_search_bar_min_free_slots_label_title') }
                </span>
                <span className="text-gray-500 font-medium w-full text-left">
                  { filters.minFreeSlots
                    ? t('activities_search_bar_min_free_slots_selected_title', { count: filters.minFreeSlots })
                    : t('activities_search_bar_min_free_slots_placeholder_title') }
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0 rounded-lg rounded-t-none shadow-xl overflow-hidden gap-0"
              align="center"
              sideOffset={ 0 }
            >
              <div className="grid grid-cols-4 divide-y divide-x">
                { SlotsOptions.map((num) => (
                  <button
                    key={ num }
                    onClick={ () => {
                      handleChange('minFreeSlots', num)
                      setIsSlotsOpen(false)
                    } }
                    className={ `h-10 font-medium flex items-center justify-center transition-colors cursor-pointer
                      ${filters.minFreeSlots === num
                    ? 'bg-brand-primary text-white border-transparent'
                    : 'hover:bg-muted'}
                    ` }
                  >
                    { num }
                  </button>
                )) }
              </div>
              { filters.minFreeSlots && (
                <button
                  onClick={ () => {
                    handleChange('minFreeSlots', null)
                    setIsSlotsOpen(false)
                  } }
                  className="w-full text-gray-500 hover:text-red-500 text-center py-2 font-medium cursor-pointer border-t"
                >
                  { t('activities_search_bar_min_free_remove_selection_title') }
                </button>
              ) }
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className={ fieldContainerClasses }>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col w-full h-full text-left focus:outline-none px-4 py-2 cursor-pointer">
                  <span className={ labelClasses }>
                    { t('activities_search_bar_statuses_label_title') }
                  </span>
                  <div className="flex items-center justify-between text-gray-500 font-medium w-full">
                    <span className="truncate">
                      { filters.statuses.length === 1
                        ? t(`activities_search_bar_statuses_${filters.statuses[0]}_status_title`)
                        : t('activities_search_bar_statuses_available_statuses_option_title')
                      }
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-t-none"
                align="start"
                sideOffset={ 0 }
              >
                <DropdownMenuCheckboxItem
                  checked={ filters.statuses.includes(ValidActivityStatus.OPEN) }
                  onCheckedChange={ (checked) => handleMultiSelectChange('statuses', 'open', checked) }
                >
                  { t('activities_search_bar_statuses_open_status_title') }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={ filters.statuses.includes(ValidActivityStatus.CONFIRMED) }
                  onCheckedChange={ (checked) => handleMultiSelectChange('statuses', 'confirmed', checked) }
                >
                  { t('activities_search_bar_statuses_confirmed_status_title') }
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className={ fieldContainerClasses }>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex flex-col w-full h-full text-left focus:outline-none px-4 py-2 cursor-pointer"
                  disabled={ !hasLevels }
                >
                  <span className={ labelClasses }>
                    { t('activities_search_bar_level_label_title') }
                  </span>
                  <div className="flex items-center justify-between text-gray-500 font-medium w-full">
                    <span className="truncate">
                      { !filters.sportId
                        ? t('activities_search_bar_level_select_sport_title')
                        : !hasLevels
                          ? t('activities_search_bar_level_no_levels_title')
                          : filters.levelIds.length > 0
                            ? t('activities_search_bar_level_n_selected_title', { count: filters.levelIds.length })
                            : t('activities_search_bar_level_any_level_option_title')
                      }
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              { hasLevels && (
                <DropdownMenuContent
                  className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-t-none"
                  align="start"
                  sideOffset={ 0 }
                >
                  { availableLevels.map((level) => (
                    <DropdownMenuCheckboxItem
                      key={ level.id }
                      checked={ filters.levelIds.includes(level.id) }
                      onCheckedChange={ (checked) => handleMultiSelectChange('levelIds', level.id, checked) }
                    >
                      { t(`ranking_capability_${level.slug}_title`) }
                    </DropdownMenuCheckboxItem>
                  )) }
                </DropdownMenuContent>
              ) }
            </DropdownMenu>
          </div>
          <div className={ fieldContainerClasses }>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col w-full h-full text-left focus:outline-none px-4 py-2 cursor-pointer">
                  <span className={ labelClasses }>
                    { t('activities_search_bar_sorting_label_title') }
                  </span>
                  <div className="flex items-center justify-between text-gray-500 font-medium w-full">
                    <span className="truncate">
                      { t(`activities_search_bar_sorting_option_${filters.sortBy}_${filters.sortDirection}_title`) }
                    </span>
                  </div>

                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-t-none"
                align="start"
                sideOffset={ 0 }
              >
                <DropdownMenuCheckboxItem
                  key={ 'date_asc' }
                  checked={ filters.sortDirection === 'asc' && filters.sortBy === 'date' }
                  onCheckedChange={ (checked) => {
                    if (checked) {
                      handleChange('sortBy', 'date')
                      handleChange('sortDirection', 'asc')
                    }
                  } }
                >
                  { t('activities_search_bar_sorting_option_date_asc_title') }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  key={ 'date_desc' }
                  checked={ filters.sortDirection === 'desc' && filters.sortBy === 'date' }
                  onCheckedChange={ (checked) => {
                    if (checked) {
                      handleChange('sortBy', 'date')
                      handleChange('sortDirection', 'desc')
                    }
                  } }
                >
                  { t('activities_search_bar_sorting_option_date_desc_title') }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  key={ 'capacity_desc' }
                  checked={ filters.sortDirection === 'desc' && filters.sortBy === 'capacity' }
                  onCheckedChange={ (checked) => {
                    if (checked) {
                      handleChange('sortBy', 'capacity')
                      handleChange('sortDirection', 'desc')
                    }
                  } }
                >
                  { t('activities_search_bar_sorting_option_capacity_desc_title') }
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  key={ 'capacity_asc' }
                  checked={ filters.sortDirection === 'asc' && filters.sortBy === 'capacity' }
                  onCheckedChange={ (checked) => {
                    if (checked) {
                      handleChange('sortBy', 'capacity')
                      handleChange('sortDirection', 'asc')
                    }
                  } }
                >
                  { t('activities_search_bar_sorting_option_capacity_asc_title') }
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Button
        onClick={ handleSearch }
        className="w-full h-12 font-bold rounded-t-none border-2 border-brand-primary"
      >
        { t('activities_search_bar_search_button_title') }
      </Button>
    </div>
  )
}
