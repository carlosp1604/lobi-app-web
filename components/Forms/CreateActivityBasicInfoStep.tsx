import Image from "next/image";
import useTranslation from 'next-translate/useTranslation';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { DateTimePickerField } from '~/components/Forms/Input/DateTimePickerField';
import { SportDetailsQueryDto } from "~/types/activity/dto/GetSportsQueryResponseDto";
import { Controller, useFormContext } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '~/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {MAX_ACTIVITY_DESCRIPTION_LENGTH} from "~/helpers/input.helper";

interface ActivityBasicInStepProps {
  sports: Array<SportDetailsQueryDto>;
  onSportChange: (value: SportDetailsQueryDto) => void;
}

export function CreateActivityBasicInfoInput({ sports, onSportChange }: ActivityBasicInStepProps) {
  const { t, lang } = useTranslation('activities');

  const { control } = useFormContext();

  return (
    <FieldGroup>
      <Controller
        name="sportId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t('create_activity_basic_info_sport_label_title')}
            </FieldLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                const sport = sports.find((sport) => sport.id === value)

                if (sport) {
                  onSportChange(sport)
                }
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('create_activity_basic_info_sports_selector_placeholder_title')}/>
              </SelectTrigger>

              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    <div className="flex items-center gap-2">
                      {sport.image_url && (
                        <Image
                          src={sport.image_url}
                          alt={sport.slug}
                          className="h-5 w-5 rounded-full object-cover border border-border"
                          width="0"
                          height="0"
                        />
                      )}
                      <span>
                        {t(`sports_${sport.slug}_title`)}
                       </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-4 -mt-0.5">
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]}/>
              )}
            </div>
          </Field>
        )}
      />

      <Controller
        name="title"
        control={control}
        render={({field, fieldState}) => (
          <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>
              {t('create_activity_basic_info_activity_title_label_title')}
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={t('create_activity_basic_info_activity_title_input_placeholder_title')}
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
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="flex justify-between items-center">
              {t('create_activity_basic_info_activity_description_label_title')}
              <span className="text-xs text-muted-foreground">
                {t('create_activity_basic_info_activity_description_character_counter_title', {
                  current: field.value?.length || 0,
                  max: MAX_ACTIVITY_DESCRIPTION_LENGTH
                })}
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={t('create_activity_basic_info_activity_description_input_placeholder_title')}
              className="resize-none"
              rows={4}
              value={field.value ?? ''}
            />
            <div className="h-4 -mt-0.5">
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]}/>
              )}
            </div>
          </Field>
        )}
      />

      <DateTimePickerField
        name="scheduledDate"
        lang={lang}
        control={control}
        label={t('create_activity_basic_info_date_time_label_title')}
        buttonTitle={t('create_activity_basic_info_date_time_button_title')}
      />
    </FieldGroup>
  );
}
