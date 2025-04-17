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

# Copy only package files and prisma schema first
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

ENV DOCKER_BUILD=true

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm add -D prisma
RUN pnpm prisma generate
RUN pnpm ts-patch install


##############################
## Build Stage              ##
##############################
FROM deps AS build

# Copy source files after dependencies are installed
COPY src ./src/
COPY tsconfig*.json nest-cli.json ./

# Build the application
RUN pnpm build


##############################
## Runtime Stage            ##
##############################
FROM base

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]