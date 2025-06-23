import db from './config';
import { currencies, rates } from './schemas';
import { sql } from 'drizzle-orm';

await db.insert(currencies).values([
  { id: 1, code: 'USD', name: 'US Dollar' },
  { id: 2, code: 'EUR', name: 'Euro' },
  { id: 3, code: 'GBP', name: 'British Pound' },
  { id: 4, code: 'JPY', name: 'Japanese Yen' },
  { id: 5, code: 'AUD', name: 'Australian Dollar' },
]);

await db.insert(rates).values([
  { base_currency_id: 1, target_currency_id: 2, rate: '0.85', effective_date: new Date() },
  { base_currency_id: 1, target_currency_id: 3, rate: '0.73', effective_date: new Date() },
  { base_currency_id: 1, target_currency_id: 4, rate: '110.25', effective_date: new Date() },
  { base_currency_id: 1, target_currency_id: 5, rate: '1.35', effective_date: new Date() },
  { base_currency_id: 1, target_currency_id: 2, rate: '0.81', effective_date: new Date('2023-07-01') },
  { base_currency_id: 1, target_currency_id: 3, rate: '0.68', effective_date: new Date('2023-07-01') },
  { base_currency_id: 1, target_currency_id: 4, rate: '109.31', effective_date: new Date('2023-07-01') },
  { base_currency_id: 1, target_currency_id: 5, rate: '1.25', effective_date: new Date('2023-07-01') },
] as any);

// Reset the serial sequence
await db.execute(sql`
  SELECT setval(pg_get_serial_sequence('currencies', 'id'), (SELECT MAX(id) FROM currencies));
`);

console.log('✅ Seeding complete');
process.exit();
