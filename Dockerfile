# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm nuxt prepare && pnpm build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
COPY --from=build /app/.output ./.output
# Content, uploaded photos and click stats live here; mount a volume to keep them.
RUN mkdir -p .data && chown node:node .data
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
