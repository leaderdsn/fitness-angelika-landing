# Лендинг Анжелики Александровой — фитнес-терапевт и хореограф

Продающий одностраничный сайт. Главная цель — привести посетителя в диалог: основная кнопка ведёт в **Telegram**, дополнительная — в **Instagram**. Тексты, цены, фото и ссылки редактируются в админке без программиста.

## Возможности

- **Лендинг с SSR** (Nuxt 4): секции «Узнаёте себя?», «Направления», «Как проходит работа», «Форматы и цены», «Обо мне», «Отзывы», «Вопросы», финальный призыв. На мобильных — липкая панель с кнопками мессенджеров.
- **SEO**: title/description и Open Graph из админки, canonical, разметка schema.org `Person`, `robots.txt`.
- **Админка** `/admin`:
  - вход по паролю и восстановление пароля через Telegram;
  - ссылки на Telegram и Instagram, текст основной кнопки;
  - тексты всех секций, списки (добавить, удалить, переместить);
  - загрузка фото для главного экрана и блока «Обо мне»;
  - статистика переходов в Telegram и Instagram за 30 дней.
- **Без внешней БД**: контент, фото и статистика хранятся в файлах в каталоге `.data/`, а на Netlify — в Netlify Blobs.

Пока ссылка на Telegram не указана, основная кнопка открывает личные сообщения в Instagram.

## Стек

Nuxt 4 (Vue 3, SSR) · Nitro · TypeScript strict · Zod · Sass (indented `.sass`) · ESLint · Vitest · Husky + lint-staged + commitlint · pnpm.

## Быстрый старт

Нужны Node.js `^22.21 || ^24.11` и pnpm 11 (`corepack enable`).

```bash
pnpm install
cp .env.example .env   # задайте пароль и секрет
pnpm dev               # http://localhost:3000, админка — /admin
```

## Переменные окружения

| Переменная | Назначение |
|---|---|
| `NUXT_ADMIN_PASSWORD` | Пароль для входа в админку. Пока он пустой, вход отключён. |
| `NUXT_SESSION_SECRET` | Ключ шифрования cookie сессии, не короче 32 символов: `openssl rand -hex 32`. |
| `NUXT_PUBLIC_SITE_URL` | Публичный адрес сайта, используется для canonical, Open Graph и ссылки восстановления пароля. |
| `NUXT_TELEGRAM_BOT_TOKEN` | Токен Telegram-бота, который присылает ссылку для смены пароля. Без него восстановление отключено. |
| `NUXT_TELEGRAM_CHAT_ID` | ID чата администратора, куда бот отправляет ссылку. |

### Восстановление пароля

1. Создайте бота у [@BotFather](https://t.me/BotFather) и запишите токен в `NUXT_TELEGRAM_BOT_TOKEN`.
2. Напишите боту любое сообщение с аккаунта администратора, затем откройте `https://api.telegram.org/bot<токен>/getUpdates` и возьмите `message.chat.id` — это `NUXT_TELEGRAM_CHAT_ID`.
3. На странице входа нажмите «Забыли пароль?» — бот пришлёт одноразовую ссылку, она действует 30 минут.

Новый пароль хранится хэшем в `.data/db/admin-password` (на Netlify — ключ `admin-password` в хранилище Blobs `data`) и с этого момента заменяет `NUXT_ADMIN_PASSWORD`; все открытые сессии админки завершаются. Чтобы снова входить с паролем из окружения, удалите этот файл или ключ.

## Скрипты

| Команда | Что делает |
|---|---|
| `pnpm dev` | Dev-сервер с горячей перезагрузкой |
| `pnpm build` | Production-сборка в `.output/` |
| `pnpm start` | Запуск собранного сервера |
| `pnpm lint` / `pnpm lint:fix` | ESLint, включая проверку границ FSD |
| `pnpm typecheck` | Проверка типов |
| `pnpm test` | Unit-тесты (Vitest) |

## Деплой

### Netlify

Netlify собирает и выкладывает сайт после каждого push в `main`, настройки сборки — в `netlify.toml`. Сайт работает как serverless-функция, а данные (контент, фото, статистика, пароль) хранятся в [Netlify Blobs](https://docs.netlify.com/blobs/overview/): Nuxt переключается на них сам, когда сборка идёт на Netlify.

Первичная настройка:

1. **Add new site → Import an existing project → GitHub**, выберите репозиторий. Ветка — `main`, остальные поля Netlify возьмёт из `netlify.toml`.
2. **Site configuration → Environment variables**: добавьте `NUXT_ADMIN_PASSWORD`, `NUXT_SESSION_SECRET`, `NUXT_TELEGRAM_BOT_TOKEN`, `NUXT_TELEGRAM_CHAT_ID` и `NUXT_PUBLIC_SITE_URL` — адрес сайта на Netlify, например `https://angelika.netlify.app`.
3. **Deploys → Trigger deploy**, чтобы сборка подхватила переменные. После смены переменных деплой тоже нужно перезапустить.

Данные на Netlify и в Docker/`.data` не связаны: контент и фото на новом сайте заполняются через его админку. Ограничение числа попыток входа на Netlify считается отдельно в каждом экземпляре функции, поэтому оно мягче, чем на своём сервере.

### Docker

```bash
cp .env.example .env   # заполните значения
docker compose up -d --build
```

Данные лежат в volume `site-data`, поэтому переживают пересборку контейнера.

Команды выполняются из папки проекта:

| Что сделать | Команда |
|---|---|
| Остановить | `docker compose down` |
| Запустить снова | `docker compose up -d` |
| Пересобрать после изменений в коде | `docker compose up -d --build` |
| Посмотреть логи | `docker compose logs -f` |

У контейнера свои данные (volume `site-data`), у `pnpm dev` — папка `./.data`: правки в одной админке не видны в другой. Оба используют порт 3000, поэтому одновременно их не запустить. Перенести данные из `./.data` в контейнер:

```bash
docker compose cp ./.data/. site:/app/.data
docker compose exec -u root site chown -R node:node /app/.data
docker compose restart
```

### Без Docker

```bash
pnpm install && pnpm build
NUXT_ADMIN_PASSWORD=... NUXT_SESSION_SECRET=... NUXT_PUBLIC_SITE_URL=https://... node .output/server/index.mjs
```

Сервер запускайте из корня проекта: данные сохраняются в `./.data`. Сайт должен открываться по **HTTPS** (например, через nginx или Caddy), иначе браузер не сохранит cookie админки. Исключение — `localhost`.

## Архитектура

Код фронтенда организован по [Feature-Sliced Design](https://feature-sliced.design/) в `src/`. Служебные каталоги Nuxt перенесены в слой `app`.

```
src/
  app/        # App.vue, AppError.vue, routes/ (маршруты Nuxt), middleware/, глобальные стили
  pages/      # landing, admin-login, admin-reset-password, admin-dashboard, not-found
  widgets/    # секции лендинга, шапка, подвал, мобильная панель, редактор контента, статистика
  features/   # contact-link, admin-auth, edit-content, upload-image
  entities/   # site-content, click-stats
  shared/     # ui-kit, lib, styles (дизайн-токены)
server/       # API (Nitro): api/, middleware/, utils/
shared/       # Zod-схема контента, контент по умолчанию, ссылки — общие для клиента и сервера (#shared)
```

- Слой импортирует только из нижележащих слоёв, слайсы одного слоя друг друга не импортируют, наружу всё отдаётся через `index.ts`. Это проверяет ESLint.
- Автоимпорт компонентов и composables из каталогов выключен, всё импортируется явно.
- Стили компонента лежат в `.sass`-файле рядом с ним, классы именуются по БЭМ, токены подключаются через `@use "@/shared/styles" as ds`.

## API

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/content` | публичный | Контент сайта |
| POST | `/api/track` | публичный | Учёт клика по кнопке мессенджера |
| GET | `/api/media/:id` | публичный | Загруженное фото |
| POST | `/api/admin/login` | — | Вход (не больше 10 попыток за 15 минут с одного IP) |
| POST | `/api/admin/logout` | — | Выход |
| GET | `/api/admin/session` | — | Статус сессии |
| POST | `/api/admin/password-reset/request` | — | Отправка ссылки для смены пароля в Telegram (не больше 3 запросов за 15 минут с одного IP) |
| POST | `/api/admin/password-reset/confirm` | — | Установка нового пароля по одноразовой ссылке и вход |
| PUT | `/api/admin/content` | админ | Сохранение контента (проверка по Zod-схеме) |
| POST | `/api/admin/upload` | админ | Загрузка фото: JPG, PNG или WebP до 4 МБ, формат определяется по сигнатуре файла |
| GET | `/api/admin/stats` | админ | Переходы за 30 дней |
