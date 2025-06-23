import { relations } from 'drizzle-orm'
import { serial, pgTable, integer, decimal, date } from 'drizzle-orm/pg-core'
import { currencies } from './currencies'

export const rates = pgTable("rates", {
  id: serial('id').primaryKey(),
  baseCurrencyId: integer('base_currency_id').references(() => currencies.id),
  targetCurrencyId: integer('target_currency_id').references(() => currencies.id),
  rate: decimal('rate', { precision: 18, scale: 6 }).notNull(),
  effectiveDate: date('effective_date').notNull(),
});

export const rateRelations = relations(rates, ({ one }) => ({
  baseCurrencyId: one(currencies, {
    fields: [rates.baseCurrencyId],
    references: [currencies.id],
    relationName: 'baseCurrencyId',
  }),
  targetCurrencyId: one(currencies, {
    fields: [rates.targetCurrencyId],
    references: [currencies.id],
    relationName: 'targetCurrencyId',
  }),
}));