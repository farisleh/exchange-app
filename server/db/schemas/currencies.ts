import { serial, pgTable, varchar } from 'drizzle-orm/pg-core'

export const currencies = pgTable("currencies", {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 3 }).notNull(),
  name: varchar('name', { length: 100 }).notNull()
});