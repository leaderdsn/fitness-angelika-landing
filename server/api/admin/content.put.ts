import { siteContentSchema } from '#shared/content'

import { writeContent } from '../../utils/content'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) => siteContentSchema.safeParse(body))
  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Проверьте заполнение полей',
      data: result.error.issues.map(({ path, message }) => ({ path, message })),
    })
  }

  await writeContent(result.data)
  return result.data
})
