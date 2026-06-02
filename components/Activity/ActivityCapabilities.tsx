import useTranslation from "next-translate/useTranslation";
import { ActivityCapabilityDto } from "~/types/activity/dto/config/capability/CapabilityDto";
import { CapabilityViewerFactory } from "~/components/Activity/Capability/CapabilityViewerFactory"; // Ajusta la ruta

export interface ActivityCapabilitiesProps {
  capabilities: Record<string, ActivityCapabilityDto>;
}

export const ActivityCapabilities = ({ capabilities }: ActivityCapabilitiesProps) => {
  const { t } = useTranslation('activities');

  const capabilityKeys = Object.keys(capabilities || {});

  if (capabilityKeys.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="font-semibold tracking-tight">
        { t('activity_details_capabilities_section_title') }
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {capabilityKeys.map((capabilityName) => {
          return CapabilityViewerFactory.getComponent(
            capabilities[capabilityName]
          );
        })}
      </div>
    </section>
  );
};
