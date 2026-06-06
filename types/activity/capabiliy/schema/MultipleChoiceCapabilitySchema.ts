import { z } from 'zod'
import { Translate } from 'next-translate'
import {
  MultipleChoiceCapabilitySchemaDto,
  MultipleChoiceOptionSchemaDto
} from '~/types/activity/dto/CapabilitySchemaDto'

// eslint-disable-next-line unused-imports/no-unused-vars
const MultipleChoiceSchema = z.array(z.uuid())

export type MultipleChoiceCapabilityDto = z.infer<typeof MultipleChoiceSchema>

export const createMultipleChoiceSchema = (config: MultipleChoiceCapabilitySchemaDto, t: Translate) => {
  const min = config.min
  const max = config.max

  return z.array(
    z.uuid({ message: t('multiple_choice_invalid_uuid_message_title') })
  )
    .min(min, { message: t('multiple_choice_min_error_title', { min }) })
    .max(max, { message: t('multiple_choice_max_error_title', { max }) })
}

export const getMultipleChoiceCapabilityDefaultValue = (): Array<string> => {
  return []
}

export const formatMultipleChoiceCapabilityData = (
  data: MultipleChoiceCapabilityDto,
  options: Array<MultipleChoiceOptionSchemaDto>,
  capabilityName: string,
  t: Translate
): Array<string> => {
  const values: Array<string> = []

  data.forEach((selectedId) => {
    const option = options.find((opt) => opt.id === selectedId)

    if (option) {
      values.push(t(`${capabilityName}_capability_${option.slug}_title`))
    }
  })

  return values
}

export const buildMultipleChoiceCapabilityPayload = (data: MultipleChoiceCapabilityDto) => {
  return { ids: data }
}
