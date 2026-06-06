import useTranslation from 'next-translate/useTranslation'
import { Button } from '~/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { MultipleChoiceInput } from '~/components/Forms/Input/MultipleChoiceInput'
import { CapabilitySchemaDto  } from '~/types/activity/dto/CapabilitySchemaDto'
import { GeographicPointInput } from '~/components/Forms/Input/Geographic/GeographicPointInput'
import { GeographicRangeInput } from '~/components/Forms/Input/Geographic/GeographicRangeInput'
import { SportDetailsQueryDto } from '~/types/activity/dto/GetSportsQueryResponseDto'
import { MagnitudeRangeCapabilityField } from '~/components/Activity/Capability/MagnitudeRangeField'
import { FieldGroup, Field, FieldTitle } from '~/components/ui/field'

interface ActivityCapabilitiesStepProps {
  sport: SportDetailsQueryDto
  activeCapabilities: Array<string>
  handleAddCapability: (key: string) => void
  handleRemoveCapability: (key: string) => void
}

export function CreateActivityCapabilitiesStep ({
  sport,
  activeCapabilities,
  handleRemoveCapability,
  handleAddCapability,
}: ActivityCapabilitiesStepProps) {
  const { t } = useTranslation('activities')

  const availableCapabilities = Object.entries(sport.config.capabilities)

  const activeCapabilityList = availableCapabilities.filter(([key]) =>
    activeCapabilities.includes(key)
  )

  const inactiveCapabilityList = availableCapabilities.filter(([key]) =>
    !activeCapabilities.includes(key)
  )

  return (
    <FieldGroup className="flex flex-col gap-y-2">
      { activeCapabilityList.map(([key, rawCapability]) => {
        const capability = rawCapability as CapabilitySchemaDto
        const fieldName = `capabilities.${key}`
        const title = t(`capability_${key}_title`)
        const description = t(`capability_${key}_description`)

        let element = null

        if (capability.type === 'scalar_point' || capability.type === 'scalar_range') {
          element = (
            <MagnitudeRangeCapabilityField
              name={ fieldName }
              config={ capability }
              title={ title }
              description={ description }
            />
          )
        } else if (capability.type === 'geographic_point') {
          element = (
            <GeographicPointInput
              name={ fieldName }
              title={ title }
              description={ description }
            />
          )
        } else if (capability.type === 'geographic_range') {
          element = (
            <GeographicRangeInput
              name={ fieldName }
              title={ title }
              description={ description }
            />
          )
        } else if (capability.type === 'multiple_choice') {
          element = (
            <MultipleChoiceInput
              name={ fieldName }
              config={ capability }
              title={ title }
              description={ description }
            />
          )
        }

        if (!element) {
          return null
        }

        return (
          <div key={ key } className="relative p-4 border rounded-lg">
            <div className="absolute right-1 top-1 z-10">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={ () => handleRemoveCapability(key) }
                className="h-5 w-5 p-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title={ t('create_activity_capabilities_remove_capability_button_title') }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            { element }
          </div>
        )
      }) }

      { inactiveCapabilityList.length > 0 && (
        <Field className={ activeCapabilities.length > 0 ? 'pt-6' : '' }>
          <FieldTitle>
            { t('create_activity_capabilities_available_capabilities_title') }
          </FieldTitle>
          <div className="flex flex-wrap gap-2">
            { inactiveCapabilityList.map(([key]) => (
              <Button
                key={ key }
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={ () => handleAddCapability(key) }
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                { t(`capability_${key}_title`) }
              </Button>
            )) }
          </div>
        </Field>
      ) }
    </FieldGroup>
  )
}
