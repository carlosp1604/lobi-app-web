'use client'

import useTranslation from 'next-translate/useTranslation'
import { es } from 'date-fns/locale'
import { cn } from '~/lib/utils'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { ChangeEvent, useState } from 'react'
import { Controller, Control } from 'react-hook-form'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, setHours, setMinutes, isValid } from 'date-fns'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

interface DateTimePickerFieldProps {
  name: string
  lang: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  label: string
  buttonTitle: string
}

export const DateTimePickerField = ({ name, lang, control, label, buttonTitle }: DateTimePickerFieldProps) => {
  const locale = lang === 'es' ? es : es
  const { t } = useTranslation('common')

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Controller
      name={ name }
      control={ control }
      render={ ({ field: { value, onChange }, fieldState }) => {
        const dateValue = value ? new Date(value) : undefined
        const isDateValid = dateValue && isValid(dateValue)

        const handleDateSelect = (selectedDate: Date | undefined) => {
          if (!selectedDate) {
            return
          }

          if (isDateValid) {
            const newDateTime = setMinutes(setHours(selectedDate, dateValue.getHours()), dateValue.getMinutes())

            onChange(newDateTime.toISOString())
          } else {
            const defaultTime = new Date()

            defaultTime.setHours(defaultTime.getHours() + 2)
            defaultTime.setMinutes(0)

            const newDateTime = setMinutes(setHours(selectedDate, defaultTime.getHours()), defaultTime.getMinutes())

            onChange(newDateTime.toISOString())
          }
        }

        const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
          const timeValue = e.target.value

          if (!timeValue) {
            return
          }

          const [hours, minutes] = timeValue.split(':').map(Number)
          const baseDate = isDateValid ? dateValue : new Date()
          const newDateTime = setMinutes(setHours(baseDate, hours), minutes)

          onChange(newDateTime.toISOString())
        }

        const timeString = isDateValid ? format(dateValue, 'HH:mm') : ''

        return (
          <Field data-invalid={ fieldState.invalid }>
            <FieldLabel>
              { label }
            </FieldLabel>
            <Popover open={ isOpen } onOpenChange={ setIsOpen }>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={ cn(
                    'w-full justify-start text-left font-normal rounded-lg',
                    'h-auto py-2 whitespace-normal',
                    !isDateValid && 'text-muted-foreground normal-case',
                    fieldState.invalid && 'border-destructive text-destructive'
                  ) }
                >
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  { isDateValid ? (
                    format(dateValue, 'PPPPp', { locale })
                  ) : (
                    <span>
                      { buttonTitle }
                    </span>
                  ) }
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0"
                align="start"
                onInteractOutside={ () => setIsOpen(false) }
              >
                <Calendar
                  mode="single"
                  selected={ isDateValid ? dateValue : undefined }
                  onSelect={ handleDateSelect }
                  locale={ locale }
                  disabled={ (date) => {
                    const today = new Date()

                    today.setHours(0, 0, 0, 0)

                    const maxDay = new Date(today)

                    maxDay.setDate(today.getDate() + 7)

                    return date < today || date > maxDay
                  } }
                />
                <div className="p-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      { t('date_time_picker_time_title') }
                    </span>
                    <Input
                      type="time"
                      value={ timeString }
                      onChange={ handleTimeChange }
                      className="w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="h-4 -mt-0.5">
              { fieldState.invalid && fieldState.error && (
                <FieldError errors={ [fieldState.error] }/>
              ) }
            </div>
          </Field>
        )
      } }
    />
  )
}
