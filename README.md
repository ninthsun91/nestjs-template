# Nestjs Template 

A production-ready NestJS template with modern features and best practices.

## Features

### Core
- Built with latest NestJS features and TypeScript
- PNPM as the default package manager for faster, disk-efficient package management
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
