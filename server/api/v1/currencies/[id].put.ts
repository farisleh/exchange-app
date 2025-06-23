import { z } from "zod"

const bodyParams = z.object({
  code: z.string(),
  name: z.string()
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  try {
    const body = await readValidatedBody(event, bodyParams.parse)
    const record = await updateCurrency(parseInt(id!), body)

    return record
  } catch (error) {
    return createError({
      statusCode: 422,
      data: error
    })
  }

})