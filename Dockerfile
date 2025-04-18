##############################
## Base Stage               ##
##############################
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update
RUN apk add --no-cache libc6-compat curl
RUN corepack enable


##############################
## Dependencies Stage       ##
##############################
FROM base AS deps

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma

ENV DOCKER_BUILD=true

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm prisma generate


##############################
## Build Stage              ##
##############################
FROM base AS build

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY src/ ./src/
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.build.json ./tsconfig.build.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm build


##############################
## Runtime Stage            ##
##############################
FROM base

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]