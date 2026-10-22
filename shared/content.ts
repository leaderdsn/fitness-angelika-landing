import { z } from 'zod'

import { isInstagramUrl, isTelegramUrl } from './links'

export const DIRECTION_ICONS = ['diastasis', 'posture', 'stretch', 'dance', 'kids', 'gym'] as const

export type DirectionIcon = (typeof DIRECTION_ICONS)[number]

const text = (max: number) => z.string().trim().max(max)
const requiredText = (max: number) => text(max).min(1, 'Заполните поле')

/** Uploaded photo (/api/media/…) or an external https image; empty string means "no photo". */
const imageSrc = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === '' || value.startsWith('/api/media/') || value.startsWith('https://'), {
    message: 'Загрузите фото или укажите https-ссылку',
  })

const titledItem = z.object({
  title: requiredText(80),
  text: text(400),
})

export const siteContentSchema = z.object({
  contacts: z.object({
    telegramUrl: z
      .string()
      .trim()
      .refine((value) => value === '' || isTelegramUrl(value), {
        message: 'Ссылка вида https://t.me/username',
      }),
    instagramUrl: z.string().trim().refine(isInstagramUrl, {
      message: 'Ссылка вида https://www.instagram.com/username/',
    }),
    ctaLabel: requiredText(40),
  }),
  seo: z.object({
    title: requiredText(80),
    description: requiredText(200),
  }),
  hero: z.object({
    badge: text(60),
    title: requiredText(120),
    subtitle: text(300),
    promisesTitle: text(40),
    promises: z.array(requiredText(120)).max(5),
    photo: imageSrc,
  }),
  problems: z.object({
    title: requiredText(80),
    items: z.array(titledItem).max(8),
  }),
  directions: z.object({
    title: requiredText(80),
    subtitle: text(200),
    items: z
      .array(
        titledItem.extend({
          icon: z.enum(DIRECTION_ICONS),
        }),
      )
      .max(8),
  }),
  steps: z.object({
    title: requiredText(80),
    items: z.array(titledItem).max(6),
  }),
  pricing: z.object({
    title: requiredText(80),
    subtitle: text(200),
    items: z
      .array(
        z.object({
          title: requiredText(60),
          format: text(60),
          price: text(40),
          features: z.array(requiredText(120)).max(8),
          featured: z.boolean(),
        }),
      )
      .max(6),
  }),
  about: z.object({
    title: requiredText(80),
    text: text(2000),
    photo: imageSrc,
    facts: z
      .array(
        z.object({
          value: requiredText(20),
          label: requiredText(60),
        }),
      )
      .max(4),
  }),
  reviews: z.object({
    title: requiredText(80),
    items: z
      .array(
        z.object({
          author: requiredText(60),
          text: requiredText(800),
        }),
      )
      .max(12),
  }),
  faq: z.object({
    title: requiredText(80),
    items: z
      .array(
        z.object({
          question: requiredText(160),
          answer: requiredText(800),
        }),
      )
      .max(12),
  }),
  finalCta: z.object({
    title: requiredText(120),
    text: text(300),
  }),
})

export type SiteContent = z.infer<typeof siteContentSchema>
