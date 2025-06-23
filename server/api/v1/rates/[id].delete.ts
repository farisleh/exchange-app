export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  try {
    await deleteRate(parseInt(id!))
  } catch (error) {
    return createError({
      statusCode: 422,
      data: error
    })
  }
})