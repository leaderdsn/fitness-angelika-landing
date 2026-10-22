export type ImageType = { extension: 'jpg' | 'png' | 'webp'; mime: string }

// Netlify functions cap request and response bodies at ~6 MB, and binary bodies grow by a third in base64.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024

const MIME_BY_EXTENSION: Record<ImageType['extension'], string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

function startsWith(data: Uint8Array, bytes: number[], offset = 0): boolean {
  return bytes.every((byte, index) => data[offset + index] === byte)
}

/** Detects the format by file signature, not by the client-provided name or MIME type. */
export function detectImageType(data: Uint8Array): ImageType | null {
  if (startsWith(data, [0xff, 0xd8, 0xff])) return { extension: 'jpg', mime: MIME_BY_EXTENSION.jpg }
  if (startsWith(data, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { extension: 'png', mime: MIME_BY_EXTENSION.png }
  }
  // RIFF....WEBP
  if (startsWith(data, [0x52, 0x49, 0x46, 0x46]) && startsWith(data, [0x57, 0x45, 0x42, 0x50], 8)) {
    return { extension: 'webp', mime: MIME_BY_EXTENSION.webp }
  }
  return null
}

export function mimeFromMediaId(id: string): string | null {
  const extension = id.split('.').pop() as ImageType['extension'] | undefined
  return extension && extension in MIME_BY_EXTENSION ? MIME_BY_EXTENSION[extension] : null
}
