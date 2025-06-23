import { z } from "zod"

const bodyParams = z.object({
  code: z.string().max(3),
  name: z.string().max(100)
})

export default defineEventHandler(async (event) => {
  try {
    const { code, name } = await readValidatedBody(event, bodyParams.parse)
    const record = await createCurrency({ code, name })
    return record
  } catch (error) {
    return createError({
      statusCode: 422,
      data: error
    })
  }
})