import vine, { Vine, BaseLiteralType } from '@vinejs/vine'
import { FieldContext, FieldOptions, Validation } from '@vinejs/vine/types'

declare module '@vinejs/vine' {
  interface Vine {
    computed(): VineComputed
  }
}

const requires = vine.createRule(
  (_: unknown, fields: string[], field: FieldContext) => {
    const missingFields = fields.filter((key) => !field.data[key])

    if (missingFields.length) return

    const info: Record<string, any> = {}

    for (let key of fields) {
      info[key] = field.data[key]
    }

    field.mutate(info, field)
  },
  {
    implicit: true,
  }
)

export class VineComputed extends BaseLiteralType<any, any, any> {
  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations)
  }

  requires(fields: string[]) {
    return this.use(requires(fields))
  }

  clone() {
    return new VineComputed(this.cloneOptions(), this.cloneValidations()) as this
  }
}

Vine.macro('computed', function () {
  return new VineComputed({ isOptional: true, allowNull: true, bail: true })
})
