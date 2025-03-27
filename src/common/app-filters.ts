import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import type { Provider } from '@nestjs/common';

export const AppFilters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: PrismaExceptionFilter,
  },
];
