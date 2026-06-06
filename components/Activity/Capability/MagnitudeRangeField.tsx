import useTranslation from 'next-translate/useTranslation'
import { X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { MagnitudeInputResolver } from '~/components/Activity/Capability/MagnitudeRangeFieldResolver'
import { ScalarCapabilitySchemaDto } from '~/types/activity/dto/CapabilitySchemaDto'
import { Controller, useWatch, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import {
  Field, FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '~/components/ui/field'
import {
  AVERAGE_DEFAULT_VALUE, AVERAGE_INITIAL_VALUE,
  END_DEFAULT_VALUE, END_INITIAL_VALUE, FORBIDDEN_UNITS
} from '~/types/activity/capabiliy/schema/MagnitudeRangeCapabilitySchema'

interface MagnitudeRangeCapabilityFieldProps {
  name: string
  config: ScalarCapabilitySchemaDto
  title: string
  description: string
}

export function MagnitudeRangeCapabilityField({
  name,
  config,
  title,
  description,
}: MagnitudeRangeCapabilityFieldProps) {
  const { t } = useTranslation('activities')

  const { control, setValue, trigger } = useFormContext()

  const endValue = useWatch({ control, name: `${name}.end` })
  const averageValue = useWatch({ control, name: `${name}.average` })
  const selectedUnit = useWatch({ control, name: `${name}.unit`, defaultValue: config.defaultUnit })

  const isEndActive = endValue !== undefined && endValue !== null
  const isAverageActive = averageValue !== undefined && averageValue !== null

  const isEndAvailable = config.availableFields.includes('end')
  const isAverageAvailable = config.availableFields.includes('average')

  return (
    <FieldSet>
      <FieldLegend>
        { title }
      </FieldLegend>
      <FieldDescription>
        { description }
      </FieldDescription>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 items-start">
        { config.supportedUnits.length > 1 && (
          <Controller
            name={ `${name}.unit` }
            control={ control }
            render={ ({ field }) => (
              <Field>
                <FieldLabel>
                  { t('magnitude_range_field_unit_label_title') }
                </FieldLabel>
                <Select
                  onValueChange={ (value) => {
                    field.onChange(value)
                    trigger(`${name}.start`).then()
                    if (isEndActive) {
                      trigger(`${name}.end`).then()
                    }
                    if (isAverageActive) {
                      trigger(`${name}.average`).then()
                    }
                  } }
                  value={ field.value }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={ t('magnitude_range_field_unit_placeholder_title') } />
                  </SelectTrigger>
                  <SelectContent>
                    { config.supportedUnits.filter((unit) => !FORBIDDEN_UNITS.includes(unit)).map((unit) => (
                      <SelectItem key={ unit } value={ unit }>
                        { t(`magnitude_range_unit_${unit}_title`) }
                      </SelectItem>
                    )) }
                  </SelectContent>
                </Select>
              </Field>
            ) }
          />
        ) }
        <Controller
          name={ `${name}.start` }
          control={ control }
          render={ ({ field: { value, onChange, ...fieldProps }, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={ fieldProps.name }>
                { isEndActive
                  ? t('magnitude_range_field_start_label_title')
                  : t('magnitude_range_field_value_label_title') }
              </FieldLabel>
              <MagnitudeInputResolver
                id={ fieldProps.name }
                value={ value }
                invalid={ fieldState.invalid }
                unit={ selectedUnit }
                capabilityName={ config.name }
                onChange={ (newVal) => {
                  onChange(newVal)
                  if (isEndActive) {
                    trigger(`${name}.end`).then()
                  }
                  if (isAverageActive) {
                    trigger(`${name}.average`).then()
                  }
                } }
              />
              <div className="h-4 -mt-0.5">
                { fieldState.invalid && fieldState.error && (
                  <FieldError errors={ [fieldState.error] }/>
                ) }
              </div>
            </Field>
          ) }
        />

        { isEndActive && (
          <Controller
            name={ `${name}.end` }
            control={ control }
            render={ ({ field: { value, onChange, ...fieldProps }, fieldState }) => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={ fieldProps.name }>
                    { t('magnitude_range_field_end_label_title') }
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-3 text-muted-foreground hover:text-foreground"
                    onClick={ () => {
                      setValue(`${name}.end`, END_DEFAULT_VALUE, { shouldValidate: true })
                      setValue(`${name}.average`, AVERAGE_DEFAULT_VALUE, { shouldValidate: true })
                      trigger(`${name}.start`).then()
                    } }
                  >
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
                <MagnitudeInputResolver
                  id={ fieldProps.name }
                  value={ value }
                  invalid={ fieldState.invalid }
                  unit={ selectedUnit }
                  capabilityName={ config.name }
                  onChange={ (newVal) => {
                    onChange(newVal)

                    trigger(`${name}.start`).then()
                    if (isAverageActive) {
                      trigger(`${name}.average`).then()
                    }
                  } }
                />
                <div className="h-4 -mt-0.5">
                  { fieldState.invalid && fieldState.error && (
                    <FieldError errors={ [fieldState.error] }/>
                  ) }
                </div>
              </Field>
            ) }
          />
        ) }

        { isAverageActive && isEndActive && (
          <Controller
            name={ `${name}.average` }
            control={ control }
            render={ ({ field: { value, onChange, ...fieldProps }, fieldState }) => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={ fieldProps.name }>
                    { t('magnitude_range_field_average_label_title') }
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-3 text-muted-foreground hover:text-foreground"
                    onClick={ () => setValue(`${name}.average`, AVERAGE_DEFAULT_VALUE, { shouldValidate: true }) }
                  >
                    <X className="h-4 w-4"/>
                  </Button>
                </div>
                <MagnitudeInputResolver
                  id={ fieldProps.name }
                  value={ value }
                  invalid={ fieldState.invalid }
                  unit={ selectedUnit }
                  capabilityName={ config.name }
                  onChange={ (newVal) => {
                    onChange(newVal)

                    trigger(`${name}.start`).then()
                    trigger(`${name}.end`).then()
                  } }
                />
                <div className="h-4 -mt-0.5">
                  { fieldState.invalid && fieldState.error && (
                    <FieldError errors={ [fieldState.error] }/>
                  ) }
                </div>
              </Field>
            ) }
          />
        ) }
      </FieldGroup>
      <Field className="flex gap-2 w-fit">
        { isEndAvailable && !isEndActive && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="p-2"
            onClick={ () => setValue(`${name}.end`, END_INITIAL_VALUE, { shouldValidate: true }) }
          >
            { t('magnitude_range_field_add_end_title') }
          </Button>
        ) }
        { isAverageAvailable && isEndActive && !isAverageActive && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="p-2"
            onClick={ () => setValue(`${name}.average`, AVERAGE_INITIAL_VALUE, { shouldValidate: true }) }
          >
            { t('magnitude_range_field_add_average_title') }
          </Button>
        ) }
      </Field>
    </FieldSet>
  )
}
