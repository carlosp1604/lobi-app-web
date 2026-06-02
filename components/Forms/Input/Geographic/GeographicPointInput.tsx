import useTranslation from "next-translate/useTranslation";
import { Button } from "~/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";
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

interface GeographicPointInputProps {
  name: string
  title: string;
  description: string;
}

export function GeographicPointInput({ name, title, description }: GeographicPointInputProps) {
  const { t } = useTranslation('activities');
  const [isMapOpen, setIsMapOpen] = useState(false);

  const { control, setValue } = useFormContext();

  const value = useWatch({ control, name });

  return (
    <FieldSet>
      <FieldLegend>
        { title }
      </FieldLegend>
      <FieldDescription>
        { description }
      </FieldDescription>
      <FieldGroup>
        <Controller
          control={ control }
          name={ name }
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                { t('geographic_location_label_title') }
              </FieldLabel>
              <Button
                aria-invalid={fieldState.invalid}
                type="button"
                variant="outline"
                className="w-full justify-start font-normal gap-2"
                onClick={() => setIsMapOpen(true)}
              >
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                {value.lat && value.lng
                  ? `${Number(value.lat).toFixed(5)}, ${Number(value.lng).toFixed(5)}`
                  : t('geographic_search_placeholder_title')}
              </Button>
            </Field>
          )}
        />
      </FieldGroup>

      <LocationMapModal
        isOpen={isMapOpen}
        title={t('geographic_modal_location_title')}
        initialLocation={value.lat && value.lng ? value : null}
        onClose={() => setIsMapOpen(false)}
        onConfirm={(loc) => {
          setValue(name, loc, { shouldValidate: true});
          setIsMapOpen(false);
        }}
      />
    </FieldSet>
  );
}
