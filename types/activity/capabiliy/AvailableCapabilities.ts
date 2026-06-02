export const AVAILABLE_CAPABILITIES = [
  'altitude',
  'distance',
  'duration',
  'location',
  'location_range',
  'pace',
  'ranking',
  'route',
  'rpe',
  'speed',
] as const

export type AvailableCapability = (typeof AVAILABLE_CAPABILITIES)[number]

export type EnforceAvailableCapabilityKeys<T extends Record<AvailableCapability, unknown>> = T
