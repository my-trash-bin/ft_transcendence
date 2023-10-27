FROM rust:1.61.0 AS builder
WORKDIR /usr/src/env-validator
COPY project/env-validator .
RUN cargo install --path .

FROM debian:buster-slim
COPY --from=builder /usr/local/cargo/bin/env-validator /usr/local/bin/env-validator
CMD ["env-validator"]
