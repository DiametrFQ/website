# backend/Dockerfile.prod

# --- Этап 1: Сборка ---
FROM rust:1-bookworm as builder
WORKDIR /app

# Устанавливаем зависимости для компиляции
RUN apt-get update && apt-get install -y build-essential pkg-config libssl-dev

# Кешируем зависимости
COPY ./Cargo.toml ./Cargo.lock ./
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release

# Копируем исходный код и собираем проект
COPY ./src ./src
RUN touch src/lib.rs && cargo build --release

# --- Этап 2: Финальный образ ---
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/target/release/backend .
RUN chmod +x ./backend

ENV RUST_LOG="info"
EXPOSE 8080
CMD ["./backend"]