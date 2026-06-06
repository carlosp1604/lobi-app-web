import { z } from 'zod'
import Big from 'big.js'

export const DecimalStringSchema = z.string().refine(
  (val) => {
    if (!val) {
      return false
    }

    try {
      new Big(val)

      return true
    } catch {
      return false
    }
  },
  { message: 'Must be a valid decimal number' }
)
