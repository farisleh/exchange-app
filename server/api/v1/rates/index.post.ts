import { z } from "zod"

const bodyParams = z.object({
  baseCurrencyId: z.number(),
  targetCurrencyId: z.number(),
  rate: z.number(),
  effectiveDate: z.string()
})

export default defineEventHandler(async (event) => {
  try {
    const { baseCurrencyId, targetCurrencyId, rate, effectiveDate } = await readValidatedBody(event, bodyParams.parse)
    const record = await createRate({ baseCurrencyId, targetCurrencyId, rate, effectiveDate })
    return record
  } catch (error) {
    return createError({
      statusCode: 422,
      data: error
    })
  }
})