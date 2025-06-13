FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./target/release/backend .
RUN chmod +x ./backend

EXPOSE 8080
ENV RUST_LOG="info"

CMD ["./backend"]