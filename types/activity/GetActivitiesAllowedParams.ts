export const GetActivitiesAllowedParams = [
  'location',
  'radius',
  'page',
  'perPage',
  'sortBy',
  'sortDirection',
  'maxDateSeconds',
  'statuses',
  'sportId',
  'minDuration',
  'maxDuration',
  'minFreeSlots',
  'levelIds',
]

export const GetActivitiesAllowedFilters = [
  'location',
  'radius',
  'maxDateSeconds',
  'statuses',
  'sportId',
  'minDuration',
  'maxDuration',
  'minFreeSlots',
  'levelIds',
] as const

export const GetActivitiesSortByOptions = [ 'date', 'capacity' ] as const

export const GetActivitiesSortDirectionOptions = [ 'asc', 'desc'] as const

export type GetActivitiesAllowedFilter = (typeof GetActivitiesAllowedFilters)[number]

export type GetActivitiesSortByOption = (typeof GetActivitiesSortByOptions)[number]

export type GetActivitiesSortDirectionOption = (typeof GetActivitiesSortDirectionOptions)[number]

export const DefaultSortByOption: GetActivitiesSortByOption = 'date'
export const DefaultSortDirectionOption: GetActivitiesSortDirectionOption = 'asc'
