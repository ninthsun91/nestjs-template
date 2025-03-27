import { NestiaSwaggerComposer } from '@nestia/sdk';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger';
import { EnvService } from './config/env.service';

async function bootstrap() {
  const logger = new LoggerService({
    prefix: 'MeshedAPI-AI',
  });
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger,
  });

  const envService = app.get(EnvService);
  const port = envService.get('port');

  const document = await NestiaSwaggerComposer.document(app, {
    openapi: '3.1',
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local',
      },
    ],
  });
  SwaggerModule.setup('doc', app, document as OpenAPIObject);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap().catch((error) => {
  const logger = new LoggerService();
  if (error instanceof Error && error.stack) {
    logger.error('Failed to start application', 'Bootstrap', error.stack);
  } else {
    logger.error('Failed to start application', 'Bootstrap');
  }
  process.exit(1);
});
