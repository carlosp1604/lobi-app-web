import Big from 'big.js'
import { z } from 'zod'
import { Translate } from 'next-translate'
import { DecimalStringSchema } from '~/types/shared/DecimalStringSchema'
import { ScalarCapabilitySchemaDto } from '~/types/activity/dto/CapabilitySchemaDto'
import { formatDuration, formatPace } from '~/helpers/formatter.helper'

export const FORBIDDEN_UNITS = ['s/km']

const MagnitudeRangeSchema = z.object({
  unit: z.string(),
  start: z.string(),
  end: z.string().nullable(),
  average: z.string().nullable(),
})

export const END_DEFAULT_VALUE = null
export const END_INITIAL_VALUE = ''
export const AVERAGE_DEFAULT_VALUE = null
export const AVERAGE_INITIAL_VALUE = ''

export type MagnitudeRangeCapabilityDto = z.infer<typeof MagnitudeRangeSchema>

export const createMagnitudeRangeCapabilitySchema = (config: ScalarCapabilitySchemaDto, t: Translate) => {
  return MagnitudeRangeSchema.extend({
    unit: z.enum(config.supportedUnits as [string, ...string[]], {
      error: t('magnitude_invalid_unit_message_title'),
    }),
  }).superRefine((data, ctx) => {
    let hasFormatErrors = false

    const validateField = (field: 'start' | 'end' | 'average'): Big | null => {
      const value = data[field]

      if (value === null) {
        return null
      }

      if (value === '' || value === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: t(`magnitude_range_required_${field}_value_message_title`),
        })
        hasFormatErrors = true

        return null
      }

      const parseResult = DecimalStringSchema.safeParse(value)

      if (!parseResult.success) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: t(`magnitude_range_invalid_${field}_value_message_title`),
        })
        hasFormatErrors = true

        return null
      }

      return new Big(value)
    }

    const startBig = validateField('start')
    const endBig = validateField('end')

    if (hasFormatErrors || !startBig) {
      return
    }

    const factorStr = config.conversionFactors[data.unit]

    if (!factorStr) {
      ctx.addIssue({
        code: 'custom',
        path: ['unit'],
        message: t('magnitude_range_unsupported_unit_message_title'),
      })

      return
    }

    const factor = new Big(factorStr)
    const baseMin = new Big(config.limits.min)
    const baseMax = new Big(config.limits.max)

    const convertedMin = baseMin.div(factor)
    const convertedMax = baseMax.div(factor)

    const getFormattedLimit = (limitValue: Big) => {
      if (config.name === 'duration') {
        return formatDuration(limitValue)
      }
      if (config.name === 'pace') {
        return formatPace(limitValue)
      }

      return limitValue.round(2).toString()
    }

    const displayMin = getFormattedLimit(convertedMin)
    const displayMax = getFormattedLimit(convertedMax)
    const displayUnit = config.name === 'duration' ? '' : data.unit

    const checkBounds = (valueBig: Big, field: 'start' | 'end' | 'average') => {
      if (valueBig.lt(convertedMin) || valueBig.gt(convertedMax)) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: t(`magnitude_range_out_of_bounds_${field}_value_message_title`, {
            min: displayMin,
            max: displayMax,
            unit: displayUnit,
          }),
        })
      }
    }

    checkBounds(startBig, 'start')

    if (endBig) {
      checkBounds(endBig, 'end')
    }

    const isInverted = config.name === 'pace'

    if (endBig) {
      const isRangeInvalid = isInverted
        ? startBig.lt(endBig)
        : startBig.gt(endBig)

      if (isRangeInvalid) {
        ctx.addIssue({
          code: 'custom',
          path: ['end'],
          message: t(isInverted
            ? 'magnitude_range_start_less_than_end_message_title'
            : 'magnitude_range_start_greater_than_end_message_title'
          ),
        })
      }
    }

    if (data.average !== null) {
      const isUnnecessary = !endBig || startBig.eq(endBig)

      if (isUnnecessary) {
        ctx.addIssue({
          code: 'custom',
          path: ['average'],
          message: t('magnitude_range_average_unnecessary_message_title'),
        })
      } else {
        const averageBig = validateField('average')

        if (averageBig) {
          checkBounds(averageBig, 'average')

          if (averageBig.lt(startBig) || averageBig.gt(endBig)) {
            ctx.addIssue({
              code: 'custom',
              path: ['average'],
              message: t('magnitude_range_average_out_of_range_message_title'),
            })
          }
        }
      }
    }
  })
}

export const getMagnitudeRangeCapabilityDefaultValue = (config: ScalarCapabilitySchemaDto) => {
  return {
    unit: config.defaultUnit,
    start: '',
    end: END_DEFAULT_VALUE,
    average: AVERAGE_DEFAULT_VALUE,
  }
}

export const formatMagnitudeRangeCapabilityData = (
  data: MagnitudeRangeCapabilityDto,
  config: ScalarCapabilitySchemaDto,
  t: Translate
): Array<string> => {
  const { start, end, average, unit } = data
  const values: Array<string> = []

  const getFormattedValue = (val: string) => {
    const bigVal = new Big(val)

    if (config.name === 'duration') {
      return formatDuration(bigVal)
    }
    if (config.name === 'pace') {
      return formatPace(bigVal)
    }

    return bigVal.round(2).toString()
  }

  const displayUnit = config.name === 'duration' ? '' : unit
  const startFormatted = getFormattedValue(start)

  if (!end || new Big(start).eq(new Big(end))) {
    values.push(t('magnitude_range_point_summary_title', {
      value: startFormatted,
      unit: displayUnit,
    }).trim())

    return values
  }

  const endFormatted = getFormattedValue(end)

  if (!average) {
    values.push(t('magnitude_range_range_summary_title', {
      start: startFormatted,
      end: endFormatted,
      unit: displayUnit,
    }).trim())

    return values
  }

  const avgFormatted = getFormattedValue(average)

  values.push(t('magnitude_range_range_with_avg_summary_title', {
    start: startFormatted,
    end: endFormatted,
    average: avgFormatted,
    unit: displayUnit,
  }).trim())

  return values
}

export const buildMagnitudeRangeCapabilityPayload = (
  data: MagnitudeRangeCapabilityDto,
  config: ScalarCapabilitySchemaDto
) => {
  if (config.type === 'scalar_point') {
    return {
      value: data.start,
      unit: data.unit,
    }
  }

  const { start, unit } = data
  const end = data.end !== '' && data.end !== undefined && data.end !== null ? data.end : null
  const average = data.average !== '' && data.average !== undefined && data.average !== null ? data.average : null

  const finalEnd = end !== null ? end : start

  const payload: Record<string, string> = {
    start,
    end: finalEnd,
    unit,
  }

  const isAverageAvailable = config.availableFields.includes('average')
  const isAverageOptional = config.optionalFields.includes('average')

  if (average !== null) {
    payload.average = average
  } else if (isAverageAvailable && !isAverageOptional) {
    payload.average = start
  }

  return payload
}
