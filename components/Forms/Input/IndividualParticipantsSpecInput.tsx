import useTranslation from "next-translate/useTranslation";
import { Input } from '~/components/ui/input';
import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '~/components/ui/field';

interface IndividualProps {
  name: string;
}

export function IndividualParticipantsSpecInput({ name }: IndividualProps) {
  const { t } = useTranslation('activities');

  const { control } = useFormContext();

  return (
    <FieldSet>
      <FieldLegend>
        { t('individual_participants_spec_field_set_legend_title') }
      </FieldLegend>
      <FieldDescription>
        { t('individual_participants_spec_field_set_description_title') }
      </FieldDescription>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`${name}.minPlayers`}
          control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                { t('individual_participants_min_participants_label_title') }
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="number"
                placeholder={t('individual_participants_min_participants_input_placeholder_title')}
                step={1}
              />
              <div className="h-4 -mt-0.5">
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]}/>
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          name={`${name}.maxPlayers`}
          control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t('individual_participants_max_participants_label_title')}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="number"
                placeholder={t('individual_participants_max_participants_input_placeholder_title')}
                step={1}
              />
              <div className="h-4 -mt-0.5">
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]}/>
                )}
              </div>
            </Field>
          )}
        />
      </FieldGroup>
    </FieldSet>
  );
}
