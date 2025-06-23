import db from '../db/config'
import { rates } from '../db/schemas'
import { eq, count, and } from 'drizzle-orm'

export async function createRate(data: any) {
  const rate = await db.insert(rates).values(data).returning()

  return await findRateById(rate[0].id)
}

export async function getRates({ page = 1, pageSize = 12, orderBy, baseCurrencyId, targetCurrencyId, effectiveDate }: any = {}) {
  const offset = (page - 1) * pageSize;

  const whereConditions = [];
  if (baseCurrencyId) {
    whereConditions.push(eq(rates.baseCurrencyId, baseCurrencyId));
  }
  if (targetCurrencyId) {
    whereConditions.push(eq(rates.targetCurrencyId, targetCurrencyId));
  }
  if (effectiveDate) {
    whereConditions.push(eq(rates.effectiveDate, effectiveDate));
  }

  const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const total = await db.select({ value: count() }).from(rates).where(whereClause);
  
  const records = await db.query.rates.findMany({
    where: whereClause,
    limit: pageSize,
    offset,
    orderBy,
    with: {
      baseCurrencyId: true,
      targetCurrencyId: true,
    },
  });

  return {
    total: total[0]?.value || 0,
    records,
  };
}

export async function findRateById(id: number) {
  return await db.query.rates.findFirst({ where: eq(rates.id, id) });
}

export async function updateRate(id: number, data: any) {

  const rate = await db.update(rates)
    .set({...data, updatedAt: new Date()})
    .where(eq(rates.id, id))
    .returning();
  return await findRateById(rate[0].id)
}

export async function updateRatesBulk(ratesToUpdate: { id: number; baseCurrencyId: number, rate: string; effectiveDate: string }[]) {
  
  return await db.transaction(async (tx) => {
    const updatedRates = [];

    for (const rate of ratesToUpdate) {
      const updated = await tx.update(rates)
        .set({ baseCurrencyId: rate.baseCurrencyId, rate: rate.rate, effectiveDate: rate.effectiveDate })
        .where(eq(rates.id, rate.id))
        .returning();

      if (updated.length === 0) {
        throw new Error(`Rate with id ${rate.id} not found`);
      }
      
      const updatedRecord = await tx.query.rates.findFirst({ where: eq(rates.id, rate.id) });
      updatedRates.push(updatedRecord);
    }

    return updatedRates;
  });
}

export async function deleteRate(id: number) {
  await db.delete(rates).where(eq(rates.id, id));
}