# backend/Dockerfile

# --- Этап 1: Установка зависимостей ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Этап 2: Сборка ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Этап 3: Финальный образ ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Копируем только необходимые для запуска артефакты
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main"]