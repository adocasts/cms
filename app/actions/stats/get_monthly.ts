import db from '@adonisjs/lucid/services/db'
import { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import { DateTime } from 'luxon'

type GetMonthlyOptions = {
  monthlyColumn?: string
  aggregateColumn?: string
  startDate?: DateTime<true>
}

export type MonthlyStat = {
  month: string
  total: number
}

export default class GetMonthly {
  static count(query: DatabaseQueryBuilderContract<MonthlyStat>, options: GetMonthlyOptions) {
    const agg = options.aggregateColumn || '*'
    const final = this.#group(query, options).count(agg, 'total')
    return this.#toType(final)
  }

  static sum(query: DatabaseQueryBuilderContract<MonthlyStat>, options: GetMonthlyOptions) {
    const agg = options.aggregateColumn || '*'
    const final = this.#group(query, options).sum(agg, 'total')
    return this.#toType(final)
  }

  static #group(query: DatabaseQueryBuilderContract<MonthlyStat>, options: GetMonthlyOptions) {
    const timestamp = options.monthlyColumn || 'created_at'
    const startDate = options.startDate || DateTime.now().minus({ year: 1 }).startOf('month')

    return query
      .whereRaw(db.raw('?? > ?', [timestamp, startDate.toSQLDate()]))
      .select(db.raw('SUBSTR(CAST(?? AS TEXT), 1, 7) AS month', timestamp)) // YYYY-MM
      .orderByRaw('month')
      .groupByRaw('month')
  }

  static async #toType(query: DatabaseQueryBuilderContract<MonthlyStat>) {
    const results = await query
    return results.map((r) => ({
      month: DateTime.fromFormat(r.month, 'yyyy-MM').toFormat('MMM yyyy'),
      total: Number(r.total),
    }))
  }
}
