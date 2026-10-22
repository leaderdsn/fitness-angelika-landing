import { isContactChannel } from '#shared/links'

import { recordClick } from '../utils/stats'

export default defineEventHandler(async (event) => {
  // sendBeacon may deliver the payload as text/plain, so the body is parsed manually.
  const raw = await readRawBody(event)
  let channel: unknown
  try {
    channel = (JSON.parse(raw ?? '{}') as { channel?: unknown }).channel
  } catch {
    channel = undefined
  }

  if (!isContactChannel(channel)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown channel' })
  }

  await recordClick(useStorage('data'), channel)
  setResponseStatus(event, 204)
  return null
})
