import { z } from "zod"

const querySchema = z.object({
  page: z.number({ coerce: true }).default(1),
  limit: z.number({ coerce: true }).default(12),
  baseCurrencyId: z.number({ coerce: true }).optional(),
  targetCurrencyId: z.number({ coerce: true }).optional(),
  effectiveDate: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const { page, limit, baseCurrencyId, targetCurrencyId, effectiveDate } = await getValidatedQuery(event, querySchema.parse)
  const { records, total } = await getRates({ page, pageSize: limit, baseCurrencyId, targetCurrencyId, effectiveDate })

  setPaginationHeaders(event, { total, page, limit })

  return records
})