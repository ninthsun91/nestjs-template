# NestJS Logger Module

This module provides a configurable logging solution for NestJS applications. 

## Features

- JSON formatting in production environments
- Human-readable console output in development
- Configurable log levels
- Easy to replace with other logging implementations

## Usage

The logger is globally available through dependency injection:

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger';

@Injectable()
export class YourService {
  constructor(private readonly logger: LoggerService) {
    // Logger is automatically configured based on NODE_ENV
    this.logger.setContext('YourService');
  }

  someMethod() {
    this.logger.log('This is a log message');
    this.logger.debug('This is a debug message');
    this.logger.warn('This is a warning message');
    this.logger.error('This is an error message', 'Optional stack trace');
    this.logger.verbose('This is a verbose message');
  }
}
```

## Configuration

Set the following environment variables to configure the logger:

- `NODE_ENV`: Set to 'production' for JSON logging format, any other value for console format
- `LOG_LEVEL`: One of 'error', 'warn', 'log', 'debug', 'verbose' (default: 'info')

## Customization

To replace the logger with a different implementation:

1. Create a new logger service that implements the same interface
2. Update the `LoggerModule` providers to use your custom implementation

Example:

```typescript
// custom-logger.module.ts
import { Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: CustomLoggerService,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {} 