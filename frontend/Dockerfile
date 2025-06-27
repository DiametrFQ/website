# --- Этап 1: Установка зависимостей ---
# Этот этап будет кэшироваться, если package.json не менялся
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Этап 2: Сборка приложения ---
# Этот этап использует зависимости из предыдущего и собирает билд
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ВАЖНО: Убедитесь, что в next.config.mjs есть 'output: "standalone"'
RUN npm run build

# --- Этап 3: Финальный, оптимизированный образ ---
# Этот этап берет ТОЛЬКО результаты сборки и ничего лишнего
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем оптимизированный standalone-билд из этапа сборки.
# Он содержит server.js и минимальный набор node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Копируем статичные ассеты (картинки, шрифты и т.д.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Копируем папку .next/static. Она нужна для клиентских JS-бандлов, CSS и т.д.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Запускаем Node.js сервер напрямую. Это эффективнее, чем `npm start`.
CMD ["node", "server.js"]