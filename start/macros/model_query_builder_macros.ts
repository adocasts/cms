import States from '#enums/states'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { LucidRow } from '@adonisjs/lucid/types/model'

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    wherePublic(): this
    whereTrue(column: string): this
    whereFalse(column: string): this
    getCount(): Promise<BigInt>
    getSum(column: string): Promise<BigInt>
    pluck<T>(column: string): Promise<T[]>
  }
}

declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    wherePublic(): this
    whereTrue(column: string): this
    whereFalse(column: string): this
    getCount(): Promise<BigInt>
    getSum(column: string): Promise<BigInt>
    pluck<T>(column: string): Promise<T[]>
  }
}

ModelQueryBuilder.macro('wherePublic', function (this: ModelQueryBuilder) {
  return this.where({ stateId: States.PUBLIC })
})

ModelQueryBuilder.macro('whereTrue', function (this: ModelQueryBuilder, column: string) {
  return this.where(column, true)
})

ModelQueryBuilder.macro('whereFalse', function (this: ModelQueryBuilder, column: string) {
  return this.where(column, false)
})

ModelQueryBuilder.macro('getCount', async function (this: ModelQueryBuilder) {
  return this.count('* as total')
    .first()
    .then((res: LucidRow) => res.$extras.total)
})

ModelQueryBuilder.macro('getSum', async function (this: ModelQueryBuilder, column: string) {
  return this.sum(column)
    .as('sum')
    .first()
    .then((res: LucidRow) => res.$extras.sum)
})

ModelQueryBuilder.macro('pluck', function (this: ModelQueryBuilder, column: string) {
  if (!['count', 'avg', 'sum'].includes(column)) {
    this.select(column)
  }

  return this.pojo().then((res: any) => {
    return res.map((row: any) => row[column])
  })
})
