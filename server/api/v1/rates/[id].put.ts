import { z } from "zod"

const bodyParams = z.object({
  base_currency_id: z.number(),
  target_currency_id: z.number(),
  rate: z.number(),
  effective_date: z.string()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  try {
    const body = await readValidatedBody(event, bodyParams.parse)
    const record = await updateRate(parseInt(id!), body)

    return record
  } catch (error) {
    return createError({
      statusCode: 422,
      data: error
    })
  }

})