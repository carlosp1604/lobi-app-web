import { ReactNode } from 'react';
import { ActivityCapabilityDto } from "~/types/activity/dto/config/capability/CapabilityDto";
import { MagnitudeRangeCapabilityViewer } from "~/components/Activity/Capability/MagnitudeCapabilityViewer";
import { GeographicCapabilityViewer } from "~/components/Activity/Capability/GeographicCapabilityViewer";

export class CapabilityViewerFactory {
  /**
   * Recibe un DTO de capability completo y devuelve el componente visual
   * correspondiente, o null si la capability no requiere renderizado.
   */
  public static getComponent(capability: ActivityCapabilityDto): ReactNode | null {
    switch (capability.type) {
      case 'scalar_range':
        return <MagnitudeRangeCapabilityViewer key={capability.name} capability={capability} />;

      case 'scalar_point':
        return null;

      // 3. PUNTOS GEOGRÁFICOS (Devolverá null internamente, pero el componente decide)
      case 'geographic_point':
      case 'geographic_range':
        return <GeographicCapabilityViewer key={capability.name} capability={capability} />;

      case 'route':
        return null;

      case 'multiple_choice':
        return null;

      default:
        console.warn(`[CapabilityViewerFactory] Unhandled capability type: ${(capability as any).type}`);
        return null;
    }
  }
}
