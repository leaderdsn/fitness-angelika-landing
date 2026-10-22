import { mimeFromMediaId } from '../../utils/imageType'

const MEDIA_ID_PATTERN = /^[\da-f-]{36}\.(?:jpg|png|webp)$/

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const mime = mimeFromMediaId(id)
  if (!MEDIA_ID_PATTERN.test(id) || !mime) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  // The fs driver returns a Buffer, Netlify Blobs an ArrayBuffer.
  const data = await useStorage('media').getItemRaw<Buffer | ArrayBuffer>(id)
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  // File names are unique per upload, so the response never changes.
  setHeader(event, 'Content-Type', mime)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return data instanceof ArrayBuffer ? Buffer.from(data) : data
})
