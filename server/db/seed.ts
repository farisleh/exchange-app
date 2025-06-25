import db from './config';
import { currencies, rates } from './schemas';
import { sql } from 'drizzle-orm';

await db.insert(currencies).values([
  { id: 1, code: 'USD', name: 'US Dollar' },
  { id: 2, code: 'EUR', name: 'Euro' },
  { id: 3, code: 'GBP', name: 'British Pound' },
  { id: 4, code: 'JPY', name: 'Japanese Yen' },
  { id: 5, code: 'AUD', name: 'Australian Dollar' },
]).onConflictDoUpdate({
  target: [currencies.id],
  set: {
    code: sql`excluded.code`,
    name: sql`excluded.name`,
  },
});

await db.insert(rates).values([
  { baseCurrencyId: 1, targetCurrencyId: 2, rate: '0.85', effectiveDate: new Date() },
  { baseCurrencyId: 1, targetCurrencyId: 3, rate: '0.73', effectiveDate: new Date() },
  { baseCurrencyId: 1, targetCurrencyId: 4, rate: '110.25', effectiveDate: new Date() },
  { baseCurrencyId: 1, targetCurrencyId: 5, rate: '1.35', effectiveDate: new Date() },
  { baseCurrencyId: 1, targetCurrencyId: 2, rate: '0.81', effectiveDate: new Date('2023-07-01') },
  { baseCurrencyId: 1, targetCurrencyId: 3, rate: '0.68', effectiveDate: new Date('2023-07-01') },
  { baseCurrencyId: 1, targetCurrencyId: 4, rate: '109.31', effectiveDate: new Date('2023-07-01') },
  { baseCurrencyId: 1, targetCurrencyId: 5, rate: '1.25', effectiveDate: new Date('2023-07-01') },
] as any);

await db.execute(sql`
  SELECT setval(pg_get_serial_sequence('currencies', 'id'), (SELECT MAX(id) FROM currencies));
`);

console.log('✅ Seeding complete');
process.exit();
