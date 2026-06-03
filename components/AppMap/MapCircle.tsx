import { useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef } from 'react'

interface MapCircleProps {
  center: google.maps.LatLngLiteral
  radiusInMeters: number
}

export function MapCircle({ center, radiusInMeters }: MapCircleProps) {
  const map = useMap()
  const circleRef = useRef<google.maps.Circle | null>(null)

  useEffect(() => {
    if (!map) {
      return
    }

    circleRef.current = new google.maps.Circle({
      map,
      fillColor: '#0070f3',
      fillOpacity: 0.12,
      strokeColor: '#0070f3',
      strokeOpacity: 0.6,
      strokeWeight: 2,
      clickable: false,
    })

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null)
      }
    }
  }, [map])

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setCenter(center)
      circleRef.current.setRadius(radiusInMeters)
    }
  }, [center, radiusInMeters])

  return null
}
