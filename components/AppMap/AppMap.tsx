import useTranslation from 'next-translate/useTranslation'
import { Slider } from '~/components/ui/slider'
import { MapCircle } from './MapCircle'
import { Field, FieldLabel } from '~/components/ui/field'
import { PlaceAutocomplete } from './PlaceAutocomplete'
import { useState, useEffect } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps'
import { AppLoader } from '~/components/AppLoader'
import { DefaultRadiusMeters, MapFallbackLocation, RadiusConversionFactor } from '~/types/shared/Location'

function MapCameraHandler({ center }: { center: google.maps.LatLngLiteral }) {
  const map = useMap()

  useEffect(() => {
    if (map) {
      map.panTo(center)
    }
  }, [map, center])

  return null
}

export interface AppMapProps {
  initialLocation?: google.maps.LatLngLiteral
  initialRadius?: number
  onRadiusChange?: (radius: number) => void
  onLocationChange: (location: google.maps.LatLngLiteral) => void
}

export default function AppMap({
  onLocationChange,
  initialLocation = undefined,
  initialRadius = undefined,
  onRadiusChange = undefined,
}: AppMapProps) {
  const { t } = useTranslation('common')

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const [loading, setLoading] = useState<boolean>(false)
  const [location, setLocation] = useState<google.maps.LatLngLiteral>(initialLocation || MapFallbackLocation)
  const [radius, setRadius] = useState<number>(initialRadius ?? DefaultRadiusMeters/RadiusConversionFactor)

  useEffect(() => {
    if (!initialLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLoading(true)
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }

            setLocation(newLocation)
            onLocationChange(newLocation)
            setLoading(false)
          },
          () => { onLocationChange(MapFallbackLocation); setLoading(false) }
        )
      } else {
        onLocationChange(MapFallbackLocation)
      }
    } else {
      onLocationChange(initialLocation)
    }

    if (onRadiusChange) {
      onRadiusChange(radius)
    }
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [])

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() }

      setLocation(newLocation)
      onLocationChange(newLocation)
    }
  }

  const handleMapClick = (e: MapMouseEvent) => {
    const latLng = e.detail.latLng

    if (latLng) {
      const newLocation = { lat: latLng.lat, lng: latLng.lng }

      setLocation({ lat: latLng.lat, lng: latLng.lng })
      onLocationChange(newLocation)
    }
  }

  return (
    <APIProvider apiKey={ apiKey }>
      <div className="flex flex-col gap-y-4 w-full h-full">
        <PlaceAutocomplete onPlaceSelect={ (newLocation) => {
          setLocation(newLocation)
          onLocationChange(newLocation)
        } }/>
        {
          onRadiusChange && (
            <Field className="w-full">
              <div className="flex items-center justify-between mb-2">
                <FieldLabel htmlFor="map-radius-slider-id" className="mb-0">
                  { t('map_radius_label_title') }
                </FieldLabel>

                <span className="text-sm font-medium text-muted-foreground">
                  { radius * RadiusConversionFactor < 1000
                    ? t('map_radius_value_meters_title', { value: radius * RadiusConversionFactor })
                    : t('map_radius_value_kilometers_title', { value: (radius * RadiusConversionFactor) / 1000 })
                  }
                </span>
              </div>

              <Slider
                id="map-radius-slider-id"
                defaultValue={ [radius] }
                min={ 0.2 }
                max={ 100 }
                step={ 0.2 }
                className="w-full"
                onValueChange={ (value) => {
                  const newRadius = value[0]

                  setRadius(newRadius)
                  onRadiusChange(newRadius)
                } }
              />
            </Field>
          )
        }
        <div className="w-full h-full flex relative rounded-md">
          { loading && (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <AppLoader/>
            </div>
          ) }
          { !loading && (
            <Map
              style={ { width: '100%', height: '100%' } }
              colorScheme={ 'LIGHT' }
              mapTypeControl={ true }
              reuseMaps={ true }
              defaultZoom={ 12 }
              defaultCenter={ location }
              mapId="app-map"
              disableDefaultUI={ true }
              gestureHandling="greedy"
              onClick={ (event) => handleMapClick(event) }
            >
              <AdvancedMarker
                position={ location }
                draggable={ !loading }
                onDragEnd={ (event) => handleMarkerDragEnd(event) }
              />
              {
                onRadiusChange &&
                <MapCircle
                  center={ location }
                  radiusInMeters={ radius * RadiusConversionFactor }
                />
              }
              <MapCameraHandler center={ location } />
            </Map>
          ) }
        </div>
      </div>
    </APIProvider>
  )
}
