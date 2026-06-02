import Big from "big.js";
import { z } from "zod";
import { Translate } from "next-translate";
import { DecimalStringSchema } from "~/types/shared/DecimalStringSchema";

export const createCoordinateSchema = (t: Translate) => {
  return z.object({
    lat: DecimalStringSchema,
    lng: DecimalStringSchema,
  }).superRefine((val, ctx) => {
    if (!val.lat || !val.lng) {
      return
    }

    const latBig = new Big(val.lat)
    const lngBig = new Big(val.lng)

    if (latBig.gt(90) || latBig.lt(-90)) {
      ctx.addIssue({
        code: 'custom',
        path: ['lat'],
        message: t('common:coordinates_lat_invalid_range_message_title')
      })
    }

    if (lngBig.gt(180) || lngBig.lt(-180)) {
      ctx.addIssue({
        code: 'custom',
        path: ['lng'],
        message: t('common:coordinates_lng_invalid_range_message_title')
      })
    }
  })
}
