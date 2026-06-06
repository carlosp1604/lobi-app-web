'use client'

import useTranslation from 'next-translate/useTranslation'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { SportDetailsQueryDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { useForm, FormProvider, FieldErrors } from 'react-hook-form'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateActivitySpecsStep } from '~/components/Forms/CreateActivitySpecsStep'
import { CapabilitySchemaDto } from '~/types/activity/dto/CapabilitySchemaDto'
import {
  buildMagnitudeRangeCapabilityPayload,
  getMagnitudeRangeCapabilityDefaultValue, MagnitudeRangeCapabilityDto
} from '~/types/activity/capabiliy/schema/MagnitudeRangeCapabilitySchema'
import {
  buildGeographicCapabilityPayload, GeographicCapabilityDto,
  getGeographicCapabilityDefaultValue
} from '~/types/activity/capabiliy/schema/GeographicCapabilitySchema'
import {
  buildMultipleChoiceCapabilityPayload,
  getMultipleChoiceCapabilityDefaultValue, MultipleChoiceCapabilityDto
} from '~/types/activity/capabiliy/schema/MultipleChoiceCapabilitySchema'
import { CreateActivityCapabilitiesStep } from '~/components/Forms/CreateActivityCapabilitiesStep'
import {
  IndividualParticipantsSpecSchemaDto,
  SpecSchemaDto,
  TeamParticipantsSpecSchemaDto
} from '~/types/activity/dto/SpecSchemaDto'
import {
  buildTeamParticipantsSpecPayload,
  createTeamParticipantsSpecDefaultValue, TeamParticipantsSpecDto
} from '~/types/activity/spec/schema/TeamParticipantsSpecSchema'
import {
  buildIndividualParticipantsSpecPayload,
  createIndividualParticipantsSpecDefaultValue, IndividualParticipantsSpecDto
} from '~/types/activity/spec/schema/IndividualParticipantsSpecSchema'
import { CreateActivityConfirmStep } from '~/components/Forms/CreateActivityConfirmStep'
import { z } from 'zod'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { ActivityService } from '~/services/activitity/ActivityService'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { CreateActivityBasicInfoInput } from '~/components/Forms/CreateActivityBasicInfoStep'
import { MAX_FUTURE_DAYS, MIN_MARGIN_MINUTES } from '~/helpers/input.helper'
import { createCreateActivityFormSchema } from '~/types/activity/CreateActivityFormSchema'
import { useAuth } from '~/hooks/useAuth'

type CreateActivityStep = 'basic-info' | 'specs' | 'capabilities' | 'confirm'

interface StepConfig {
  step: CreateActivityStep
  index: number
  titleKey: string
  descriptionKey: string
  fieldsToValidate: string[]
}

const STEPS: StepConfig[] = [
  {
    step: 'basic-info',
    index: 0,
    titleKey: 'create_activity_step_basic_info_title',
    descriptionKey: 'create_activity_step_basic_info_description',
    fieldsToValidate: ['title', 'sportId', 'scheduledDate', 'description'],
  },
  {
    step: 'specs',
    index: 1,
    titleKey: 'create_activity_step_specs_title',
    descriptionKey: 'create_activity_step_specs_description',
    fieldsToValidate: ['specs'],
  },
  {
    step: 'capabilities',
    index: 2,
    titleKey: 'create_activity_step_capabilities_title',
    descriptionKey: 'create_activity_step_capabilities_description',
    fieldsToValidate: ['capabilities'],
  },
  {
    step: 'confirm',
    index: 3,
    titleKey: 'create_activity_step_confirm_title',
    descriptionKey: 'create_activity_step_confirm_description',
    fieldsToValidate: [],
  },
]

interface CreateActivityProps {
  sports: Array<SportDetailsQueryDto>
}

export const CreateActivity = ({ sports }: CreateActivityProps) => {
  const { t } = useTranslation('activities')

  const { status } = useAuth()
  const { push, replace } = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      void replace('/')
    }
  }, [status, replace])

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0)
  const [selectedSport, setSelectedSport] = useState<SportDetailsQueryDto | null>(null)
  const [activeCapabilities, setActiveCapabilities] = useState<Array<string>>([])
  const [loading, setLoading] = useState<boolean>(false)

  const formSchema = useMemo(() => {
    return createCreateActivityFormSchema(selectedSport, activeCapabilities, t)
  // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [selectedSport, activeCapabilities])

  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      sportId: '',
      scheduledDate: '',
      description: null,
      capabilities: {},
      specs: {},
    },
  })

  const { trigger, handleSubmit, setValue, unregister, reset, getValues, formState: { errors } } = methods

  const stepHasErrors = (stepFields: string[]) => {
    return stepFields.some((fieldPath) => {
      if (fieldPath === 'specs') {
        return !!errors.specs
      }
      if (fieldPath === 'capabilities') {
        return !!errors.capabilities
      }

      return !!errors[fieldPath as keyof typeof errors]
    })
  }

  const getDefaultCapabilityValue = (capability: CapabilitySchemaDto) => {
    if (capability.type === 'scalar_point' || capability.type === 'scalar_range') {
      return getMagnitudeRangeCapabilityDefaultValue(capability)
    }

    if (capability.type === 'geographic_point' || capability.type === 'geographic_range') {
      return getGeographicCapabilityDefaultValue(capability)
    }

    if (capability.type === 'multiple_choice') {
      return getMultipleChoiceCapabilityDefaultValue()
    }

    return undefined
  }

  const handleAddCapability = (key: string) => {
    setActiveCapabilities((prev) => [...prev, key])

    const capability = selectedSport?.config.capabilities[key]

    if (capability) {
      const defaultValue = getDefaultCapabilityValue(capability as CapabilitySchemaDto)

      setValue(`capabilities.${key}`, defaultValue, { shouldValidate: true })
    }
  }

  const handleRemoveCapability = (key: string) => {
    const newActiveCapabilities = activeCapabilities.filter((k) => k !== key)

    setActiveCapabilities(newActiveCapabilities)

    if (newActiveCapabilities.length < 1) {
      setValue('capabilities', {}, { shouldValidate: true })
    } else {
      unregister(`capabilities.${key}`)
    }
  }

  const handleSportSelect = (sport: SportDetailsQueryDto) => {
    setSelectedSport(sport)

    const defaultSpecs = Object.keys(sport.config.specs).reduce((acc, key) => {
      if (key === 'team_participants') {
        const specConfig = sport.config.specs[key] as TeamParticipantsSpecSchemaDto

        acc[key] = createTeamParticipantsSpecDefaultValue(specConfig)
      }
      if (key === 'individual_participants') {
        const specConfig = sport.config.specs[key] as IndividualParticipantsSpecSchemaDto

        acc[key] = createIndividualParticipantsSpecDefaultValue(specConfig)
      }

      return acc
    }, {} as Record<string, unknown>)

    reset({
      ...getValues(),
      sportId: sport.id,
      capabilities: {},
      specs: defaultSpecs,
    })
  }

  const currentStep = STEPS[currentStepIndex]

  const goToStep = async (targetIndex: number) => {
    if (targetIndex < currentStepIndex) {
      setCurrentStepIndex(targetIndex)

      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isCurrentStepValid = await trigger(currentStep.fieldsToValidate as any)

    if (isCurrentStepValid) {
      const nextUnlocked = Math.max(maxUnlockedStep, currentStepIndex + 1)

      setMaxUnlockedStep(nextUnlocked)

      if (targetIndex <= nextUnlocked) {
        setCurrentStepIndex(targetIndex)
      }
    }
  }

  type CreateActivityFormSchema = z.infer<typeof formSchema>

  const onFinalSubmit = async (values: CreateActivityFormSchema) => {
    const payload = structuredClone(values)

    if (payload.capabilities && Object.keys(payload.capabilities).length > 0) {
      Object.keys(payload.capabilities).forEach((key) => {
        const config = selectedSport!.config.capabilities[key] as CapabilitySchemaDto
        const formValue = payload.capabilities![key]

        if (!config || !formValue) {
          return
        }

        switch (config.type) {
          case 'multiple_choice':
            payload.capabilities![key] = buildMultipleChoiceCapabilityPayload(formValue as MultipleChoiceCapabilityDto)
            break

          case 'geographic_point':
          case 'geographic_range':
            payload.capabilities![key] = buildGeographicCapabilityPayload(formValue as GeographicCapabilityDto, config)
            break

          case 'scalar_point':
          case 'scalar_range':
            payload.capabilities![key] = buildMagnitudeRangeCapabilityPayload(formValue as MagnitudeRangeCapabilityDto, config)
            break

          default:
            payload.capabilities![key] = formValue
            break
        }
      })
    }

    if (payload.specs && Object.keys(payload.specs).length > 0) {
      Object.keys(payload.specs).forEach((key) => {
        const config = selectedSport!.config.specs[key] as SpecSchemaDto
        const formValue = payload.specs![key]

        if (!config || !formValue) {
          return
        }

        switch (key) {
          case 'individual_participants':
            payload.specs![key] = buildIndividualParticipantsSpecPayload(formValue as IndividualParticipantsSpecDto)
            break

          case 'team_participants':
            payload.specs![key] = buildTeamParticipantsSpecPayload(formValue as TeamParticipantsSpecDto)
            break

          default:
            payload.specs![key] = formValue
            break
        }
      })
    }

    setLoading(true)

    const activityService = new ActivityService()
    const result = await activityService.createActivity(
      payload.sportId,
      payload.title,
      payload.description,
      payload.scheduledDate,
      {
        capabilities: payload.capabilities || {},
        specs: payload.specs || {},
      }
    )

    setLoading(false)
    if (result.success) {
      push(`/activities/${result.value.id}/`)

      toast.success(t('create_activity_activity_created_successfully_title'))

      return
    }

    const appError = result.error

    if (!appError.isForm() && !appError.isStandard()) {
      toast.error(t(appError.getTranslationKey()))

      return
    }

    if (appError.isStandard()) {
      toast.error(t(appError.getTranslationKey()))

      return
    }

    if (appError.isForm()) {
      const dateError = appError.getFieldError('scheduledDate')

      if (dateError) {
        methods.setError('scheduledDate', {
          type: 'server',
          message: t('create_activity_invalid_scheduled_date_message_title', {
            minutes: MIN_MARGIN_MINUTES,
            days: MAX_FUTURE_DAYS,
          }),
        })
        goToStep(0)

        return
      }
    }
  }

  const onInvalidSubmit = (errors: FieldErrors<CreateActivityFormSchema>) => {
    const targetStepIndex = STEPS.findIndex((step) => {
      return step.fieldsToValidate.some((field) => {
        if (field === 'specs') {
          return !!errors.specs
        }
        if (field === 'capabilities') {
          return !!errors.capabilities
        }

        return !!errors[field as keyof typeof errors]
      })
    })

    if (targetStepIndex !== -1) {
      goToStep(targetStepIndex)
      toast.error(t('create_activity_form_contains_errors_message_title'))
    }
  }

  let stepContent = null

  switch (currentStep.step) {
    case 'basic-info':
      stepContent = (
        <CreateActivityBasicInfoInput
          sports={ sports }
          onSportChange={ handleSportSelect }
        />
      )
      break
    case 'specs':
      stepContent = (
        <CreateActivitySpecsStep sport={ selectedSport! } />
      )
      break
    case 'capabilities':
      stepContent = (
        <CreateActivityCapabilitiesStep
          sport={ selectedSport! }
          activeCapabilities={ activeCapabilities }
          handleRemoveCapability={ handleRemoveCapability }
          handleAddCapability={ handleAddCapability }
        />
      )
      break
    case 'confirm':
      stepContent = (<CreateActivityConfirmStep sport={ selectedSport! }/>)
      break
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return null
  }

  return (
    <FormProvider { ...methods }>
      <form onSubmit={ handleSubmit(onFinalSubmit, onInvalidSubmit) } className="flex flex-col max-w-2xl mx-auto w-full px-4">
        <ToggleGroup
          type="single"
          value={ String(currentStepIndex) }
          onValueChange={ (value) => {
            if (value) {
              void goToStep(Number(value))
            }
          } }
          className="flex items-center justify-center gap-x-4 mb-4"
        >
          { STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isLocked = idx > maxUnlockedStep

            const hasError = stepHasErrors(step.fieldsToValidate)

            return (
              <ToggleGroupItem
                key={ step.step }
                value={ String(idx) }
                disabled={ isLocked }
                type="button"
                variant="outline"
                className={ cn(
                  'cursor-pointer w-10 h-10 border rounded-lg flex items-center justify-center',
                  'text-sm font-medium transition-all duration-200',
                  {
                    'border-destructive text-destructive bg-background hover:bg-destructive/10': hasError,
                    'bg-brand-primary border-brand-primary text-white hover:bg-brand-primary/80': isCompleted && !hasError,
                    'bg-background border-muted text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed':
                      !isCompleted && !hasError,
                    'ring-2 ring-brand-primary/40 ring-offset-2 ring-offset-background': isCurrent,
                  }
                ) }
              >
                { isCompleted && !hasError ? <Check className="h-5 w-5" /> : (idx + 1) }
              </ToggleGroupItem>
            )
          }) }
        </ToggleGroup>

        <Card>
          <CardHeader className="mb-4">
            <CardTitle>
              { t(currentStep.titleKey) }
            </CardTitle>
            <CardDescription>
              { t(currentStep.descriptionKey) }
            </CardDescription>
          </CardHeader>
          <CardContent>
            { stepContent }
          </CardContent>
          <CardFooter className="flex justify-between py-4 px-6 border-t bg-muted/20">
            { currentStepIndex > 0 && (
              <Button
                key="button-prev"
                type="button"
                variant="outline"
                onClick={ (event) => {
                  event.preventDefault()
                  goToStep(currentStepIndex - 1)
                } }
              >
                { t('create_activity_previous_step_button_title') }
              </Button>
            ) }

            { currentStepIndex < STEPS.length - 1 ? (
              <Button
                key="button-next"
                type="button"
                onClick={ (event) => {
                  event.preventDefault()
                  goToStep(currentStepIndex + 1)
                } }
              >
                { t('create_activity_next_step_button_title') }
              </Button>
            ) : (
              <Button
                key="button-submit"
                type="submit"
                disabled={ loading }
              >
                { loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/> }
                { !loading && t('create_activity_confirm_step_submit_button') }
              </Button>
            ) }
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
