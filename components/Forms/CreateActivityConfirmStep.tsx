import useTranslation from "next-translate/useTranslation";
import { Badge } from "~/components/ui/badge";
import { SportDetailsQueryDto } from "~/types/activity/dto/GetSportsQueryResponseDto";
import { useFormContext, useWatch } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Activity, AlertTriangleIcon, Calendar, Settings2 } from "lucide-react";
import {
  formatIndividualParticipantsSpecData,
  IndividualParticipantsSpecDto
} from "~/types/activity/spec/schema/IndividualParticipantsSpecSchema";
import {
  formatTeamParticipantsSpecData, TeamParticipantsSpecDto
} from "~/types/activity/spec/schema/TeamParticipantsSpecSchema";
import {
  formatGeographicCapabilityData,
  GeographicCapabilityDto
} from "~/types/activity/capabiliy/schema/GeographicCapabilitySchema";
import {
  CapabilitySchemaDto,
  GeographicCapabilitySchemaDto, MultipleChoiceCapabilitySchemaDto,
  ScalarCapabilitySchemaDto
} from "~/types/activity/dto/CapabilitySchemaDto";
import {
  formatMultipleChoiceCapabilityData,
  MultipleChoiceCapabilityDto
} from "~/types/activity/capabiliy/schema/MultipleChoiceCapabilitySchema";
import {
  formatMagnitudeRangeCapabilityData,
  MagnitudeRangeCapabilityDto
} from "~/types/activity/capabiliy/schema/MagnitudeRangeCapabilitySchema";

export interface CreateActivityConfirmStepProps {
  sport: SportDetailsQueryDto
}

export const CreateActivityConfirmStep = ({ sport }: CreateActivityConfirmStepProps) => {
  const { t } = useTranslation('activities');
  const { control, getValues } = useFormContext();

  const capabilities = useWatch({ control, name: 'capabilities' });
  const values = getValues();

  const hasLocation =
    capabilities.location !== undefined ||
    capabilities.location_range !== undefined ||
    capabilities.route !== undefined

  return (
    <div className="flex flex-col gap-4">
      {!hasLocation && (
        <Alert className="border-amber-300 bg-amber-50 text-amber-700">
          <AlertTriangleIcon/>
          <AlertTitle>
            { t('create_activity_confirm_step_no_location_warning_title') }
          </AlertTitle>
          <AlertDescription>
            { t('create_activity_confirm_step_no_location_warning_description') }
          </AlertDescription>
        </Alert>
      )}
      <div className="border rounded-xl bg-muted/10 overflow-hidden text-left">
        <div className="p-5 bg-background border-b">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold leading-tight text-foreground">
              {values.title}
            </h3>
            <Badge variant="secondary">
              {t(`sports_${sport.slug}_title`)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
            <Calendar className="h-4 w-4"/>
            <span>
              {new Intl.DateTimeFormat('es', {dateStyle: 'long', timeStyle: 'short'}).format(new Date(values.scheduledDate))}
            </span>
          </div>

          {values.description ? (
            <div className="mt-4 flex gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
              <p className="whitespace-pre-wrap">
                {values.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic mt-4">
              {t('create_activity_confirm_step_no_description_title')}
            </p>
          )}
        </div>

        <div className="p-5 border-b border-border/50">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground">
            <Settings2 className="h-4 w-4 text-primary"/>
            {t('create_activity_confirm_step_activity_specs_section_title')}
          </h4>

          {Object.keys(values.specs || {}).length > 0 ? (
            <div className="flex flex-col gap-y-5">
              {Object.entries(values.specs).map(([key, value]) => {
                let formattedItems: string[] = [];

                if (key === 'individual_participants') {
                  formattedItems.push(formatIndividualParticipantsSpecData(value as IndividualParticipantsSpecDto, t));
                } else if (key === 'team_participants') {
                  formattedItems = formatTeamParticipantsSpecData(value as TeamParticipantsSpecDto, t);
                }

                return (
                  <div key={key} className="flex flex-col">
                    <span className="text-[11px] uppercase text-muted-foreground mb-1">
                      {t(`spec_${key}_title`)}
                    </span>

                    <ul className="flex flex-col gap-1.5 mt-1">
                      {formattedItems.map((item, index) => (
                        <li key={index} className="text-sm font-medium text-foreground flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0 mt-1.5"/>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t('create_activity_confirm_step_activity_specs_section_no_specs_title')}
            </p>
          )}
        </div>

        <div className="p-5">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground">
            <Activity className="h-4 w-4 text-primary"/>
            {t('create_activity_confirm_step_activity_capabilities_section_title')}
          </h4>

          {Object.keys(values.capabilities || {}).length > 0 ? (
            <div className="flex flex-col gap-y-5">
              {Object.entries(values.capabilities).map(([key, value]) => {

                const capabilityConfig = sport.config.capabilities[key] as CapabilitySchemaDto;
                let formattedItems: string[] = [];

                if (!capabilityConfig) {
                  formattedItems = [typeof value === 'object' ? JSON.stringify(value) : String(value)];
                } else if (key === 'location' || key === 'location_range') {
                  formattedItems = formatGeographicCapabilityData(value as GeographicCapabilityDto, capabilityConfig as GeographicCapabilitySchemaDto, t);
                } else if (key === 'ranking') {
                  formattedItems = formatMultipleChoiceCapabilityData(
                    value as MultipleChoiceCapabilityDto,
                    (capabilityConfig as MultipleChoiceCapabilitySchemaDto).options,
                    capabilityConfig.name,
                    t
                  );
                } else {
                  formattedItems = formatMagnitudeRangeCapabilityData(
                    value as MagnitudeRangeCapabilityDto,
                    capabilityConfig as ScalarCapabilitySchemaDto,
                    t
                  );
                }

                return (
                  <div key={key} className="flex flex-col">
                    <span className="text-[11px] uppercase text-muted-foreground mb-1">
                      {t(`capability_${key}_title`)}
                    </span>

                    <ul className="flex flex-col gap-1.5 mt-1">
                      {formattedItems.map((item, index) => (
                        <li key={index} className="text-sm font-medium text-foreground flex items-start gap-2 mask-circle">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0 mt-1.5"/>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t('create_activity_confirm_step_activity_specs_section_no_capabilities_title')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
