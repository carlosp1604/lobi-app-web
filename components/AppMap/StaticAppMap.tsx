import useTranslation from "next-translate/useTranslation";
import { Slider } from "~/components/ui/slider";
import { MapCircle } from './MapCircle'
import { Field, FieldLabel } from "~/components/ui/field";
import { PlaceAutocomplete } from './PlaceAutocomplete'
import { useState, useEffect } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps'

export type StaticAppMapProps = {
  location: google.maps.LatLngLiteral
}

export default function StaticAppMap({ location }: StaticAppMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const [zoom, setZoom] = useState(12);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full flex relative rounded-md">
        <Map
          style={{ width: '100%', height: '100%' }}
          colorScheme={'LIGHT'}
          mapTypeControl={true}
          keyboardShortcuts={false}
          reuseMaps={true}
          gestureHandling="greedy"
          mapId="app-map"
          disableDefaultUI={true}
          center={location}
          zoom={zoom}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
        >
          <AdvancedMarker
            position={location}
            draggable={false}
          />
        </Map>
      </div>
    </APIProvider>
  )
}
