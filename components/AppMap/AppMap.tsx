import useTranslation from "next-translate/useTranslation";
import { Slider } from "~/components/ui/slider";
import { MapCircle } from './MapCircle'
import { Field, FieldLabel } from "~/components/ui/field";
import { PlaceAutocomplete } from './PlaceAutocomplete'
import { useState, useEffect } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps'

const SPAIN_FALLBACK_LOCATION = { lat: 40.416775, lng: -3.703790 }
const DEFAULT_RADIUS_METERS = 10000

function MapCameraHandler({ center }: { center: google.maps.LatLngLiteral }) {
  const map = useMap()
  useEffect(() => {
    if (map) {
      map.panTo(center)
    }
  }, [map, center])
  return null
}

export type AppMapProps = {
  onRadiusChange?: (radius: number) => void
  onLocationChange: (location: google.maps.LatLngLiteral) => void
}

export default function AppMap({
  onLocationChange,
  onRadiusChange = undefined
}: AppMapProps) {
  const { t } = useTranslation('common');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const [location, setLocation] = useState<google.maps.LatLngLiteral>(SPAIN_FALLBACK_LOCATION)
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS_METERS)

  const defaultRadius = 1000

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(newLocation)
          onLocationChange(newLocation)
        },
        () => { onLocationChange(SPAIN_FALLBACK_LOCATION) }
      )
    } else {
      onLocationChange(SPAIN_FALLBACK_LOCATION)
    }

    if (onRadiusChange) {
      onRadiusChange(defaultRadius)
    }
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
      setLocation({ lat: latLng.lat, lng: latLng.lng });
      onLocationChange(newLocation);
    }
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="flex flex-col gap-y-4 w-full h-full">
        <PlaceAutocomplete onPlaceSelect={(newLocation) => {
          setLocation(newLocation)
          onLocationChange(newLocation)
        }}/>
        {
          onRadiusChange &&
          <Field className="w-full">
            <FieldLabel htmlFor="map-radius-slider-id">
              { t('map_radius_label_title') }
            </FieldLabel>
            <Slider
              id="map-radius-slider-id"
              defaultValue={[defaultRadius]}
              min={100}
              max={50000}
              step={100}
              className="w-full"
              onValueChange={(value) => {
                const newRadius = value[0]
                setRadius(newRadius)
                onRadiusChange(newRadius)
              }}
            />
          </Field>
        }
        <div className="w-full h-full flex relative rounded-xl overflow-hidden border border-border">
          <Map
            style={{ width: '100%', height: '100%' }}
            colorScheme={'LIGHT'}
            mapTypeControl={true}
            reuseMaps={true}
            defaultZoom={12}
            defaultCenter={location}
            mapId="app-map"
            disableDefaultUI={true}
            gestureHandling="greedy"
            onClick={(event) => handleMapClick(event)}
          >
            <AdvancedMarker
              position={location}
              draggable={true}
              onDragEnd={(event) => handleMarkerDragEnd(event)}
            />
            {
              onRadiusChange &&
              <MapCircle center={location} radiusInMeters={radius} />
            }
            <MapCameraHandler center={location} />
          </Map>
        </div>
      </div>
    </APIProvider>
  )
}
