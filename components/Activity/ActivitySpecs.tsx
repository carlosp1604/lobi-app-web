import useTranslation from "next-translate/useTranslation";
import {ActivitySpecDto} from "~/types/activity/dto/config/spec/SpecDto";
import {SpecViewerFactory} from "~/components/Activity/Spec/SpecViewerFactory";

export interface ActivitySpecsProps {
  specs: Record<string, ActivitySpecDto>;
}

export const ActivitySpecs = ({ specs }: ActivitySpecsProps) => {
  const { t } = useTranslation('activities');

  const specKeys = Object.keys(specs || {});

  if (specKeys.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="font-semibold tracking-tight">
        { t('activity_details_specs_section_title') }
      </h2>

      <div className="grid grid-cols-1">
        {specKeys.map((specName) => {
          return SpecViewerFactory.getComponent(specs[specName]);
        })}
      </div>
    </section>
  );
};
