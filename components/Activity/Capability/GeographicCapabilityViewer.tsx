import useTranslation from 'next-translate/useTranslation'
import { ReactNode } from 'react'
import { StaticAppMap } from '~/components/AppMap/StaticAppMap'
import { MapPinIcon, FlagIcon } from 'lucide-react'
import { LocationCapabilityDto, LocationRangeCapabilityDto } from '~/types/activity/dto/config/capability/CapabilityDto'

export interface GeographicCapabilityViewerProps {
  capability: LocationCapabilityDto | LocationRangeCapabilityDto
}

interface SingleLocationMapCardProps {
  title: string
  description: string
  helpText?: string
  location: { lat: number; lng: number }
  icon: ReactNode
}

const SingleLocationMapCard = ({
  title,
  description,
  helpText,
  location,
  icon,
}: SingleLocationMapCardProps) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-card border rounded-xl shadow-sm transition-all hover:shadow-md md:col-span-2">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-secondary/50 rounded-lg shrink-0">
          { icon }
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">
            { title }
          </span>
          <span className="text-sm font-medium text-foreground">
            { description }
          </span>
          { helpText && (
            <span className="text-xs text-muted-foreground font-mono mt-0.5">
              { helpText }
            </span>
          ) }
        </div>
      </div>

      <div className="w-full h-52 rounded-lg overflow-hidden border border-border relative bg-secondary/20">
        <StaticAppMap location={ location } />
      </div>
    </div>
  )
}

export const GeographicCapabilityViewer = ({ capability }: GeographicCapabilityViewerProps) => {
  const { t } = useTranslation('activities')
  const { name, type, data } = capability

  const parseCoordinates = (latString?: string, lngString?: string) => {
    if (!latString || !lngString) {
      return null
    }

    const lat = parseFloat(latString)
    const lng = parseFloat(lngString)

    return isNaN(lat) || isNaN(lng) ? null : { lat, lng }
  }

  if (type === 'geographic_point') {
    const location = parseCoordinates(data.lat, data.lng)

    if (!location) {
      return null
    }

    return (
      <SingleLocationMapCard
        title={ t(`capability_${name}_title`) }
        description={ t(`activity_details_capabilities_${name}_description`) }
        location={ location }
        icon={ <MapPinIcon className="w-5 h-5 text-blue-500" /> }
        helpText={ t('activity_details_capabilities_lat_lng_help_title', { lat: location.lat, lng: location.lng }) }
      />
    )
  }

  if (type === 'geographic_range') {
    const startLocation = parseCoordinates(data.start?.lat, data.start?.lng)
    const endLocation = parseCoordinates(data.end?.lat, data.end?.lng)

    if (!startLocation && !endLocation) return null

    const samePoint = !!(
      startLocation &&
      endLocation &&
      startLocation.lat === endLocation.lat &&
      startLocation.lng === endLocation.lng
    )

    if (samePoint && startLocation) {
      return (
        <SingleLocationMapCard
          title={ t(`capability_${name}_title`) }
          description={ t('activity_details_capabilities_location_description') }
          helpText={ t('activity_details_capabilities_lat_lng_help_title', { lat: startLocation.lat, lng: startLocation.lng }) }
          location={ startLocation }
          icon={ <MapPinIcon className="w-5 h-5 text-blue-500" /> }
        />
      )
    }

    return (
      <div className="flex flex-col gap-4 p-4 bg-card border rounded-xl shadow-sm transition-all hover:shadow-md md:col-span-2">
        <div className="flex items-center gap-2.5 border-b pb-2">
          <div className="p-2 bg-secondary/50 rounded-lg shrink-0">
            <FlagIcon className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase mb-0.5">
              { t(`capability_${name}_title`) }
            </span>
            <span className="text-sm font-medium text-foreground">
              { t(`activity_details_capabilities_${name}_description`) }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          { startLocation && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-1">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  { t('activity_details_capabilities_start_lat_lng_help_title', { lat: startLocation.lat, lng: startLocation.lng }) }
                </span>
              </div>
              <div className="w-full h-44 rounded-lg overflow-hidden border border-border relative bg-secondary/20">
                <StaticAppMap location={ startLocation } />
              </div>
            </div>
          ) }

          { endLocation && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-1">
                <FlagIcon className="w-3.5 h-3.5 text-red-500" />
                <span>
                  { t('activity_details_capabilities_end_lat_lng_help_title', { lat: endLocation.lat, lng: endLocation.lng }) }
                </span>
              </div>
              <div className="w-full h-44 rounded-lg overflow-hidden border border-border relative bg-secondary/20">
                <StaticAppMap location={ endLocation } />
              </div>
            </div>
          ) }
        </div>
      </div>
    )
  }

  return null
}
