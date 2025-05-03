FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY ../.. .

RUN pnpm install

WORKDIR /app/apps/fetcher

RUN pnpm --filter fetcher run build

FROM node:18-alpine AS runtime

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/apps/fetcher ./apps/fetcher
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/fetcher

RUN pnpm install --prod

CMD ["node", "dist/index.js"]
