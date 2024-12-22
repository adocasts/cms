enum CouponDurations {
  FOREVER = 1,
  ONCE = 2,
}

export const CouponDurationDesc: Record<CouponDurations, string> = {
  [CouponDurations.FOREVER]: 'Forever',
  [CouponDurations.ONCE]: 'Once',
}

export default CouponDurations
