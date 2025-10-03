# Monorepo dev: build context = repo root
FROM node:20-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@9 --activate

# Chỉ cài deps cho package web (pnpm workspaces)
FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --filter ./apps/web...

# Dev runner: copy source web và dùng node_modules đã cài
FROM base AS dev
COPY --from=deps /repo/node_modules /repo/node_modules
COPY --from=deps /repo/apps/web/node_modules /repo/apps/web/node_modules
COPY apps/web apps/web
WORKDIR /repo/apps/web
EXPOSE 3000
CMD ["pnpm","dev"]
