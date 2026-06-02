import useTranslation from "next-translate/useTranslation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { LocationMapModal } from "~/components/Forms/Input/Geographic/LocationMapModal";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from "~/components/ui/field";
import {END_DEFAULT_VALUE, END_INIT_VALUE} from "~/types/activity/capabiliy/schema/GeographicCapabilitySchema";

interface GeographicRangeInputProps {
  name: string;
  title: string;
  description: string;
}

export function GeographicRangeInput({ name, title, description }: GeographicRangeInputProps) {
  const { t } = useTranslation('activities');

  const [mapTarget, setMapTarget] = useState<'start' | 'end' | null>(null);

  const { control, setValue } = useFormContext();

  const startValue = useWatch({ control, name: `${name}.start` });
  const endValue = useWatch({ control, name: `${name}.end` });

  const isEndActive = endValue !== null;

  const handleConfirmLocation = (loc: { lat: string; lng: string }) => {
    if (mapTarget) {
      setValue(`${name}.${mapTarget}`, loc, { shouldValidate: true, shouldDirty: true });
    }
    setMapTarget(null);
  };

  return (
    <FieldSet>
      <FieldLegend>
        { title }
      </FieldLegend>
      <FieldDescription>
        { description }
      </FieldDescription>
      <FieldGroup className="flex flex-col gap-4">
        <Controller
          control={control}
          name={`${name}.start`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {isEndActive
                  ? t('geographic_start_label_title')
                  : t('geographic_location_label_title')}
              </FieldLabel>
              <Button
                aria-invalid={fieldState.invalid}
                type="button"
                variant="outline"
                className="w-full justify-start font-normal gap-2"
                onClick={() => setMapTarget('start')}
              >
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                {startValue?.lat && startValue?.lng
                  ? `${Number(startValue.lat).toFixed(5)}, ${Number(startValue.lng).toFixed(5)}`
                  : t('geographic_search_placeholder_title')}
              </Button>
            </Field>
          )}
        />

        {!isEndActive && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => setValue(`${name}.end`, END_INIT_VALUE)}
          >
            {t('geographic_add_end_location_button_title')}
          </Button>
        )}

        {isEndActive && (
          <Controller
            control={control}
            name={`${name}.end`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>
                    {t('geographic_end_label_title')}
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-4 text-muted-foreground hover:text-foreground"
                    onClick={() => setValue(`${name}.end`, END_DEFAULT_VALUE)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  aria-invalid={fieldState.invalid}
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal gap-2"
                  onClick={() => setMapTarget('end')}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {endValue?.lat && endValue?.lng
                    ? `${Number(endValue.lat).toFixed(5)}, ${Number(endValue.lng).toFixed(5)}`
                    : t('geographic_search_placeholder_title')}
                </Button>
              </Field>
            )}
          />
        )}
      </FieldGroup>

      <LocationMapModal
        isOpen={mapTarget !== null}
        title={
          mapTarget === 'start'
            ? t('geographic_modal_start_location_title')
            : t('geographic_modal_end_location_title')
        }
        initialLocation={
          mapTarget === 'start' && startValue?.lat && startValue?.lng
            ? startValue
            : mapTarget === 'end' && endValue?.lat && endValue?.lng
              ? endValue
              : null
        }
        onClose={() => setMapTarget(null)}
        onConfirm={handleConfirmLocation}
      />
    </FieldSet>
  );
}
