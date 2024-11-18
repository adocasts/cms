import { BaseModelDto } from '@adocasts.com/dto/base'
import Invoice from '#models/invoice'
import UserDto from '#dtos/user'

export default class InvoiceDto extends BaseModelDto {
  declare id: number
  declare userId: number
  declare invoiceId: string
  declare invoiceNumber: string
  declare chargeId: string
  declare amountDue: number
  declare amountPaid: number
  declare amountRemaining: number
  declare status: string | null
  declare paid: boolean | null
  declare periodStartAt: string | null
  declare periodEndAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare user: UserDto | null

  constructor(invoice?: Invoice) {
    super()

    if (!invoice) return
    this.id = invoice.id
    this.userId = invoice.userId
    this.invoiceId = invoice.invoiceId
    this.invoiceNumber = invoice.invoiceNumber
    this.chargeId = invoice.chargeId
    this.amountDue = invoice.amountDue
    this.amountPaid = invoice.amountPaid
    this.amountRemaining = invoice.amountRemaining
    this.status = invoice.status
    this.paid = invoice.paid
    this.periodStartAt = invoice.periodStartAt?.toISO()!
    this.periodEndAt = invoice.periodEndAt?.toISO()!
    this.createdAt = invoice.createdAt.toISO()!
    this.updatedAt = invoice.updatedAt.toISO()!
    this.user = invoice.user && new UserDto(invoice.user)
  }
}