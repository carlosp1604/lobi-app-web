import { ReactNode } from 'react'
import {
  ActivityCapabilityDto,
  LocationCapabilityDto,
  LocationRangeCapabilityDto, MagnitudeRangeCapabilityDto
} from '~/types/activity/dto/config/capability/CapabilityDto'
import { MagnitudeRangeCapabilityViewer } from '~/components/Activity/Capability/MagnitudeCapabilityViewer'
import { GeographicCapabilityViewer } from '~/components/Activity/Capability/GeographicCapabilityViewer'

export class CapabilityViewerFactory {
  public static getComponent(capability: ActivityCapabilityDto): ReactNode | null {
    if (!capability) {
      return null
    }

    const capabilityName = capability.name

    switch (capability.type) {
      case 'scalar_range':
        return (
          <MagnitudeRangeCapabilityViewer
            key={ capability.name }
            capability={ capability as MagnitudeRangeCapabilityDto }
          />
        )

      case 'scalar_point':
        return null

      case 'geographic_point':
      case 'geographic_range':
        return (
          <GeographicCapabilityViewer
            key={ capability.name }
            capability={ capability as LocationCapabilityDto | LocationRangeCapabilityDto }
          />
        )

      case 'route':
        return null

      case 'multiple_choice':
        return null

      default:
        throw Error(`Viewer for capability ${capabilityName} is not registered`)
    }
  }
}
