import { z } from 'zod'

export const EmptyResponseSchema = z.preprocess(
  (val) => (val === '' || val === null ? undefined : val),
  z.void()
)
