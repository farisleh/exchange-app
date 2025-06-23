import db from '../db/config'
import { currencies } from '../db/schemas'
import { eq, count } from 'drizzle-orm'

export async function createCurrency(data: any) {
  const currency = await db.insert(currencies).values(data).returning()

  return await findCurrencyById(currency[0].id)
}

export async function getCurrencies({ page, pageSize, orderBy, where }: any = {}) {
  const filter: any = {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }
  if (orderBy) {
    filter["orderBy"] = orderBy
  }
  if (where) {
    filter["where"] = where
  }
 
  const countValue = await db.select({ value: count() }).from(currencies).where(filter["where"]);
  if (!countValue) {
    return { total: 0, records: [] }
  }
  const records = await db.query.currencies.findMany(filter);
  return { total: countValue[0].value, records }
}

export async function findCurrencyById(id: number) {
  return await db.query.currencies.findFirst({ where: eq(currencies.id, id) });
}

export async function updateCurrency(id: number, data: any) {

  const currency = await db.update(currencies)
    .set({...data, updatedAt: new Date()})
    .where(eq(currencies.id, id))
    .returning();
  return await findCurrencyById(currency[0].id)
}

export async function deleteCurrency(id: number) {
  await db.delete(currencies).where(eq(currencies.id, id));
}