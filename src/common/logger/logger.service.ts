import { ConsoleLogger, ConsoleLoggerOptions, Injectable, LogLevel, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  private isProduction: boolean;

  constructor(options: ConsoleLoggerOptions = {}) {
    super(options);

    const deployEnv = process.env.DEPLOY_ENV || 'development';
    this.isProduction = deployEnv === 'production';
  }

  log(message: string, context?: string): void {
    this.formatAndCallSuper('log', message, context);
  }

  error(error: Error): void;
  error(message: string, trace?: unknown, context?: string): void;
  error(errorOrMessage: Error | string, trace?: unknown, context?: string): void {
    if (errorOrMessage instanceof Error) {
      this.formatAndCallSuper('error', errorOrMessage.toString(), context, errorOrMessage.stack);
    } else if (trace instanceof Error) {
      this.formatAndCallSuper('error', errorOrMessage, context, trace.stack);
    } else {
      this.formatAndCallSuper('error', errorOrMessage, context);
    }
  }

  warn(message: string, context?: string): void {
    this.formatAndCallSuper('warn', message, context);
  }

  debug(message: string, context?: string): void {
    this.formatAndCallSuper('debug', message, context);
  }

  verbose(message: string, context?: string): void {
    this.formatAndCallSuper('verbose', message, context);
  }

  private formatAndCallSuper(level: LogLevel, message: string, context?: string, trace?: string): void {
    if (this.isProduction) {
      // In production, log in JSON format
      const logObject: Record<string, any> = {
        level,
        message,
        context: context || this.context,
        timestamp: new Date().toISOString(),
      };

      if (trace) {
        logObject.trace = trace;
      }

      // Using appropriate console methods that definitely exist
      if (level === 'error') console.error(JSON.stringify(logObject));
      else if (level === 'warn') console.warn(JSON.stringify(logObject));
      else if (level === 'debug') console.debug(JSON.stringify(logObject));
      else if (level === 'verbose') console.log(JSON.stringify(logObject));
      else console.log(JSON.stringify(logObject));
    } else {
      // In development, use standard ConsoleLogger
      if (level === 'error' && trace) {
        super.error(message, trace, context);
      } else {
        super[level](message, context);
      }
    }
  }
}
