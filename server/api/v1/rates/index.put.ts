import { z } from 'zod';

const rateUpdateSchema = z.object({
  id: z.number(),
  baseCurrencyId: z.number().optional(),
  targetCurrencyId: z.number().optional(),
  rate: z.number(),
  effectiveDate: z.string(),
});

const bulkUpdateSchema = z.array(rateUpdateSchema);

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, bulkUpdateSchema.parse);

    const updatedRecords = await updateRatesBulk(body as any);

    return updatedRecords;
  } catch (error) {
    return createError({
      statusCode: 422,
      data: error,
    });
  }
});
