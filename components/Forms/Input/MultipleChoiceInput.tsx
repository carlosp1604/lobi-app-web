import useTranslation from "next-translate/useTranslation";
import { Checkbox } from "~/components/ui/checkbox";
import { MultipleChoiceCapabilitySchemaDto } from "~/types/activity/dto/CapabilitySchemaDto";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Field,
  FieldContent, FieldDescription,
  FieldGroup,
  FieldLabel, FieldLegend,
  FieldSet,
  FieldTitle
} from '~/components/ui/field';

interface MultipleChoiceInputProps {
  name: string
  config: MultipleChoiceCapabilitySchemaDto;
  title: string
  description: string
}

export function MultipleChoiceInput({
  name,
  config,
  title,
  description,
}: MultipleChoiceInputProps) {
  const { t } = useTranslation('activities');

  const { control, setValue } = useFormContext();
  const value: Array<string> = useWatch({ control, name });

  const maxSelections = config.max

  const sortedOptions = [...config.options].sort((a, b) => a.order - b.order);

  const toggleOption = (optionId: string) => {
    const isSelected = value.includes(optionId);

    if (isSelected) {
      setValue(name, value.filter((id) => id !== optionId), { shouldValidate: true});
    } else {
      if (value.length < maxSelections) {
        setValue(name, [...value, optionId], { shouldValidate: true });
      }
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldGroup>
          <FieldSet data-invalid={fieldState.invalid}>
            <FieldLegend>
              { title }
            </FieldLegend>
            <FieldDescription>
              { description }
            </FieldDescription>
            <FieldGroup className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {sortedOptions.map((option) => {
                const isSelected = value.includes(option.id);
                const isMaxReached = !isSelected && value.length >= maxSelections;

                return (
                  <FieldLabel key={option.id}>
                    <Field orientation="horizontal" className="cursor-pointer">
                      <Checkbox
                        name={field.name}
                        id={option.id}
                        checked={field.value.includes(option.id)}
                        onCheckedChange={() => toggleOption(option.id)}
                        disabled={isMaxReached}
                      />
                      <FieldContent>
                        <FieldTitle>
                          { t(`${config.name}_capability_${option.slug}_title`)}
                        </FieldTitle>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                )
              })}
            </FieldGroup>
            <span className="flex text-muted-foreground justify-end">
              {t('multiple_choice_input_selections_title', {current: value?.length, max: maxSelections})}
            </span>
          </FieldSet>
      </FieldGroup>
    )}/>
  );
}
