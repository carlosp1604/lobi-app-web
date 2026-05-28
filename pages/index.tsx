import dynamic from 'next/dynamic'
import {Loader} from "~/components/AppLoader";
import {useState} from "react";

const AppMap = dynamic(
  () => import('~/components/AppMap/AppMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        <Loader />
      </div>
    )
  }
)

export default function Home() {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>()
  const [radius, setRadius] = useState<number>(0)

  return (
    <div>
      <div className="w-[600px] h-[500px]">
        <AppMap
          onLocationChange={(newLocation) => setLocation(newLocation)}
          onRadiusChange={(newRadius) => setRadius(newRadius)}
        />
        <div>{location?.lat}</div>
        <div>{radius}</div>
      </div>
    </div>
  )
}
