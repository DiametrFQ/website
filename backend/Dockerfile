FROM rust:1-slim as builder
# Устанавливаем ВСЕ зависимости для компиляции (openssl-dev, build-essential...)
RUN apt-get install -y libssl-dev build-essential ...
WORKDIR /app
COPY Cargo.toml .
# СКАЧИВАЕМ ЗАВИСИМОСТИ RUST (crates)
RUN cargo build --release 
COPY src ./src
# СОБИРАЕМ КОД
RUN cargo build --release 

# Этап 2: Запуск
FROM rust:1-slim
# Устанавливаем РАНТАЙМ-зависимости (ca-certificates)
RUN apt-get install -y ca-certificates
WORKDIR /app
# Копируем бинарник с прошлого этапа
COPY --from=builder /app/target/release/backend .
CMD ["./backend"]