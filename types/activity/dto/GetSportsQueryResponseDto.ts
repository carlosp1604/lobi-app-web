import { z } from 'zod'
import { SpecSchemaFactory } from '~/types/activity/spec/SpecSchemaFactory'
import { CapabilitySchemaFactory } from '~/types/activity/capabiliy/CapabilitySchemaFactory'

export const SportConfigQueryDtoSchema = z.object({
  capabilities: z.record(z.string(), z.unknown()).superRefine((capabilitiesRecord, ctx) => {
    for (const [key, value] of Object.entries(capabilitiesRecord)) {
      const validator = CapabilitySchemaFactory.getValidator(key)

      const result = validator.safeParse(value)

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [key, ...issue.path],
          })
        })
      }
    }
  }),

  specs: z.record(z.string(), z.unknown()).superRefine((specsRecord, ctx) => {
    for (const [key, value] of Object.entries(specsRecord)) {
      const validator = SpecSchemaFactory.getValidator(key)

      const result = validator.safeParse(value)

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: [key, ...issue.path],
          })
        })
      }
    }
  }),
})

export const SportDetailsQueryDtoSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  image_url: z.url().nullable(),
  config: SportConfigQueryDtoSchema,
})

export const GetSportsQueryResponseDtoSchema = z.object({
  sports: z.array(SportDetailsQueryDtoSchema),
  count: z.coerce.number().int().nonnegative(),
})

export type SportDetailsQueryDto = z.infer<typeof SportDetailsQueryDtoSchema>
export type GetSportsQueryResponseDto = z.infer<typeof GetSportsQueryResponseDtoSchema>
