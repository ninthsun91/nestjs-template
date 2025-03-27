import { NestiaSwaggerComposer } from '@nestia/sdk';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

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
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
