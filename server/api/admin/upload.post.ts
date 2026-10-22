import { randomUUID } from 'node:crypto'

import { detectImageType, MAX_IMAGE_BYTES } from '../../utils/imageType'

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const file = parts?.find((part) => part.name === 'file' && part.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Файл не передан' })
  }
  if (file.data.byteLength > MAX_IMAGE_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Файл больше 5 МБ' })
  }

  const type = detectImageType(file.data)
  if (!type) {
    throw createError({ statusCode: 415, statusMessage: 'Поддерживаются только JPG, PNG и WebP' })
  }

  const id = `${randomUUID()}.${type.extension}`
  await useStorage('media').setItemRaw(id, file.data)
  return { src: `/api/media/${id}` }
})
