FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api-gateway/package.json apps/api-gateway/package.json
RUN pnpm install --filter ./apps/api-gateway...

FROM base AS dev
COPY --from=deps /repo/node_modules /repo/node_modules
COPY --from=deps /repo/apps/api-gateway/node_modules /repo/apps/api-gateway/node_modules
COPY apps/api-gateway/tsconfig.json apps/api-gateway/tsconfig.json
COPY apps/api-gateway/src apps/api-gateway/src
# Prisma nên đặt ở apps/api-gateway/prisma (không phải src/prisma)
COPY apps/api-gateway/prisma apps/api-gateway/prisma
WORKDIR /repo/apps/api-gateway
EXPOSE 4000
CMD ["pnpm","dev"]
