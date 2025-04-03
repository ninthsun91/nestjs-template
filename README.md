# Nestjs Template 

A production-ready NestJS template with modern features and best practices.

## Features

### Core
- Built with latest NestJS features and TypeScript
- PNPM as the default package manager for faster, disk-efficient package management
- ESLint with `@stylistic/eslint-plugin` for code formatting and linting
  > Note: Prettier is intentionally not used as its auto formatting, especially line breaking, can make NestJS code less readable, and it provides very limited customization options.
- Git hooks with Husky, lint-staged, and commit-lint for code quality enforcement

### API Development
- Nestia & Typia for automatic API documentation and type-safe serialization
- Runtime Swagger documentation for API exploration
- Custom logger and API logging interceptor for better debugging
- Built-in API security features

### Database
- Prisma ORM integration for type-safe database operations
- Database migrations and schema management

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up your environment variables
4. Set up DB and run migrations: `pnpm db:dev`
5. Start the development server: `pnpm start:dev`

## Required Extensions

For the best development experience, install:
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - For code formatting and linting
