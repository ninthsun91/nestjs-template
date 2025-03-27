import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { env } from '../env';

type LoadedEnv = ReturnType<typeof env>;

@Injectable()
export class EnvService implements OnModuleInit {
  private readonly logger = new Logger(EnvService.name);

  constructor(private readonly configService: ConfigService<LoadedEnv>) {}

  onModuleInit() {
    this.checkUndefinedValues();
  }

  public get<K extends keyof LoadedEnv>(key: K): LoadedEnv[K] {
    const value = this.configService.get(key, { infer: true });
    if (value === undefined) {
      const message = `Missing environment variable: ${key}`;
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }

    return value as LoadedEnv[K];
  }

  private checkUndefinedValues() {
    const loadedEnv = env();
    const missingVars: string[] = [];

    if (loadedEnv) {
      // Check top-level properties
      Object.keys(loadedEnv).forEach((key) => {
        const value = loadedEnv[key as keyof LoadedEnv];

        // Check for undefined values
        if (value === undefined) {
          missingVars.push(key);
        }

        // Check nested objects
        if (value && typeof value === 'object') {
          Object.keys(value).forEach((nestedKey) => {
            const nestedValue = (value as Record<string, unknown>)[nestedKey];
            if (nestedValue === undefined || nestedValue === '') {
              missingVars.push(`${key}.${nestedKey}`);
            }
          });
        }
      });
    }

    if (missingVars.length > 0) {
      const message = `Missing environment variables: ${missingVars.join(', ')}`;
      this.logger.error(message);
      process.exit(1);
    }

    this.logger.log('All environment variables are defined');
  }
}
