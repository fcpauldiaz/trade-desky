FROM node:22.12-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG VITE_RECEIVER_API_URL
ARG VITE_CREEM_CHECKOUT_URL
ENV VITE_RECEIVER_API_URL=$VITE_RECEIVER_API_URL
ENV VITE_CREEM_CHECKOUT_URL=$VITE_CREEM_CHECKOUT_URL

RUN npm run build

WORKDIR /app/.output/server
RUN npm install --omit=dev

FROM node:22.12-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/.output ./.output
COPY --from=build /app/drizzle ./drizzle

ENV AUTH_MIGRATIONS_DIR=/app/drizzle

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-3000}/" || exit 1

CMD ["node", ".output/server/index.mjs"]
