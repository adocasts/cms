import { BaseModelDto } from '@adocasts.com/dto/base'
import Plan from '#models/plan'

export default class PlanDto extends BaseModelDto {
  declare id: number
  declare slug: string
  declare name: string
  declare description: string
  declare stripePriceId: string | null
  declare stripePriceTestId: string | null
  declare price: number
  declare isActive: boolean
  declare couponCode: string | null
  declare couponDiscountFixed: number | null
  declare couponDiscountPercent: number | null
  declare couponDurationId: number | null
  declare stripeCouponId: string | null
  declare couponStartAt: string | null
  declare couponEndAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare mode: string
  declare priceId: string | null
  declare hasActiveSale: boolean
  declare couponDescriptor?: string
  declare salePrice: number
  declare displayPrice: string
  declare displaySalePrice: string

  declare meta: Record<string, any>

  constructor(plan?: Plan) {
    super()

    if (!plan) return
    this.id = plan.id
    this.slug = plan.slug
    this.name = plan.name
    this.description = plan.description
    this.stripePriceId = plan.stripePriceId
    this.stripePriceTestId = plan.stripePriceTestId
    this.price = plan.price
    this.isActive = plan.isActive
    this.couponCode = plan.couponCode
    this.couponDiscountFixed = plan.couponDiscountFixed
    this.couponDiscountPercent = plan.couponDiscountPercent
    this.couponDurationId = plan.couponDurationId
    this.stripeCouponId = plan.stripeCouponId
    this.couponStartAt = plan.couponStartAt?.toISO()!
    this.couponEndAt = plan.couponEndAt?.toISO()!
    this.createdAt = plan.createdAt.toISO()!
    this.updatedAt = plan.updatedAt.toISO()!
    this.mode = plan.mode
    this.priceId = plan.priceId
    this.hasActiveSale = !!plan.hasActiveSale
    this.couponDescriptor = plan.couponDescriptor
    this.salePrice = plan.salePrice
    this.displayPrice = plan.displayPrice
    this.displaySalePrice = plan.displaySalePrice

    this.meta = plan.$extras
  }
}
