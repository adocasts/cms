import CouponDurations from '#enums/coupon_durations'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import { exists } from './helpers/db.js'

export const couponValidator = vine.compile(
  vine.object({
    couponCode: vine.string().maxLength(100).optional().nullable(),
    couponDiscountFixed: vine.number().range([0, 999]).optional().nullable(),
    couponDiscountPercent: vine.number().range([0, 999]).optional().nullable(),
    couponStartAt: vine
      .date()
      .optional()
      .nullable()
      .transform((date) => date && DateTime.fromJSDate(date)),
    couponEndAt: vine
      .date()
      .optional()
      .nullable()
      .transform((date) => date && DateTime.fromJSDate(date)),
    couponDurationId: vine.number().enum(CouponDurations).optional().nullable(),
    stripeCouponId: vine.string().optional().nullable(),
    planIds: vine.array(vine.number().exists(exists('plans', 'id'))),
  })
)
