import useTranslation from 'next-translate/useTranslation';
import { X } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { Controller, useWatch, useFormContext } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '~/components/ui/field';
import {
  MIN_PLAYERS_DEFAULT_VALUE, MIN_PLAYERS_START_VALUE,
} from "~/types/activity/spec/schema/TeamParticipantsSpecSchema";

interface TeamParticipantsSpecFieldProps {
  name: string;
}

export function TeamParticipantsSpecInput({
  name,
}: TeamParticipantsSpecFieldProps) {
  const { t } = useTranslation('activities');

  const { trigger, control, setValue } = useFormContext();

  const currentMinTeams = useWatch({ control, name: `${name}.minTeams` });
  const currentMaxTeams = useWatch({ control, name: `${name}.maxTeams` });
  const currentMinPlayers = useWatch({ control, name: `${name}.minPlayers` });

  const [showMaxTeams, setShowMaxTeams] = useState(currentMaxTeams !== currentMinTeams);
  const [showMinPlayers, setShowMinPlayers] = useState(currentMinPlayers !== null);

  const handleRemoveMaxTeams = () => {
    setShowMaxTeams(false);
    setValue(`${name}.maxTeams`, currentMinTeams, { shouldValidate: true });
  };

  const handleRemoveMinPlayers = () => {
    setShowMinPlayers(false);
    setValue(`${name}.minPlayers`, MIN_PLAYERS_DEFAULT_VALUE, { shouldValidate: true });
  };

  const handleAddMaxTeams = () => {
    setShowMaxTeams(true);
    setValue(`${name}.maxTeams`, currentMinTeams);
  };

  const handleAddMinPlayers = () => {
    setShowMinPlayers(true);
    setValue(`${name}.minPlayers`, MIN_PLAYERS_START_VALUE);
  };

  return (
    <FieldSet>
      <FieldLegend>
        { t('team_participants_spec_field_set_legend_title') }
      </FieldLegend>
      <FieldDescription>
        { t('team_participants_spec_field_set_description_title') }
      </FieldDescription>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name={`${name}.minTeams`}
          control={control}
          render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldProps.name}>
                { t('team_participants_min_teams_label_title') }
              </FieldLabel>
              <Input
                {...fieldProps}
                id={fieldProps.name}
                aria-invalid={fieldState.invalid}
                type="number"
                step={1}
                placeholder={ t('team_participants_min_teams_input_placeholder_title') }
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);

                  if (!showMaxTeams) {
                    setValue(`${name}.maxTeams`, e.target.value, { shouldValidate: true });
                  } else {
                    trigger(`${name}.maxTeams`).then()
                  }
                }}
              />
              <div className="h-4 -mt-0.5">
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          name={`${name}.playersPerTeam`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                { t('team_participants_players_per_team_label_title')}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="number"
                placeholder={t('team_participants_players_per_team_input_placeholder_title')}
                step={1}
              />
              <div className="h-4 -mt-0.5">
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />

        {showMaxTeams && (
          <Controller
            name={`${name}.maxTeams`}
            control={control}
            render={({ field: { name, onChange, ...fieldProps }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={name}>
                    { t('team_participants_max_teams_label_title')}
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-4 text-muted-foreground hover:text-foreground"
                    onClick={handleRemoveMaxTeams}
                    aria-label={t('team_participants_max_teams_remove_button_title')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  {...fieldProps}
                  id={name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  placeholder={t('team_participants_max_teams_input_placeholder_title')}
                  step={1}
                  onChange={(e) => {
                    onChange(e.target.value);
                    trigger(`${name}.minTeams`).then()
                  }}
                />
                <div className="h-4 -mt-0.5">
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>
              </Field>
            )}
          />
        )}

        {showMinPlayers && (
          <Controller
            name={`${name}.minPlayers`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* ESTRUCTURA CORREGIDA: Label y Botón hermanos */}
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>
                    { t('team_participants_min_players_label_title')}
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-4 text-muted-foreground hover:text-foreground"
                    onClick={handleRemoveMinPlayers}
                    aria-label={t('team_participants_min_players_remove_button_title')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  placeholder={t('team_participants_min_players_input_placeholder_title')}
                  step={1}
                />
                <div className="h-4 -mt-0.5">
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>
              </Field>
            )}
          />
        )}
      </FieldGroup>

      <div className="flex gap-2 flex-wrap">
        {!showMaxTeams && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMaxTeams}
          >
            { t('team_participants_add_max_teams_button_title') }
          </Button>
        )}
        {!showMinPlayers && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMinPlayers}
          >
            { t('team_participants_add_min_players_button_title') }
          </Button>
        )}
      </div>
    </FieldSet>
  );
}
