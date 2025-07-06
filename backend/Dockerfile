FROM rust:1-bullseye AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential libssl-dev pkg-config && rm -rf /var/lib/apt/lists/*

COPY ./backend/Cargo.toml ./backend/Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cd backend && cargo build --release

COPY ./backend/src ./src
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=builder /app/target/release/backend .
RUN chmod +x ./backend

EXPOSE 8080
CMD ["./backend"]