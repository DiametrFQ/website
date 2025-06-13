# backend/Dockerfile

# Этап 1: Сборка приложения
FROM rust:1-slim as builder

# Устанавливаем необходимые системные зависимости для сборки:
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Cargo.toml Cargo.lock* ./

RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release --target x86_64-unknown-linux-gnu
RUN rm -rf src target/x86_64-unknown-linux-gnu/release/deps/backend*

COPY src ./src

RUN cargo build --release --target x86_64-unknown-linux-gnu

# Этап 2: Создание образа для запуска
# ИСПОЛЬЗУЕМ ТОТ ЖЕ БАЗОВЫЙ ОБРАЗ, ЧТО И ДЛЯ СБОРКИ, или очень похожий
# rust:1-slim уже содержит необходимые runtime-библиотеки для OpenSSL,
# с которой он сам собран, и ca-certificates.
FROM rust:1-slim
# Если rust:1-slim не содержит libssl в runtime или вы хотите быть уверены,
# то можно установить нужную версию явно.
# Сначала нужно понять, какая версия OpenSSL в rust:1-slim.
# Можно проверить это, запустив контейнер: docker run -it --rm rust:1-slim openssl version
# Если это OpenSSL 3.x, то libssl3 должно быть доступно или установлено.
# Если это OpenSSL 1.1.x, то libssl1.1.

# Для rust:1-slim (который на Debian Bookworm или новее) обычно OpenSSL 3.x
# Попробуем установить libssl3, если оно не включено по умолчанию.
# Но часто в образах *-slim уже есть необходимые рантайм библиотеки.
# ca-certificates обычно нужны.
RUN apt-get update && apt-get install -y \
    ca-certificates \
    # Попробуем без явной установки libsslX, так как rust:1-slim должен сам это предоставлять
    # для той версии, с которой собран libssl-dev внутри него.
    # Если все еще будет ошибка, тогда раскомментируйте и установите нужную версию:
    # libssl3 \ # Если rust:1-slim на Bookworm/новее и приложение слинковалось с OpenSSL 3
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/x86_64-unknown-linux-gnu/release/backend .

EXPOSE 8080
ENV RUST_LOG="info"
CMD ["./backend"]