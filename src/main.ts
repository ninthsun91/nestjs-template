import { NestiaSwaggerComposer } from '@nestia/sdk';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app: INestApplication = await NestFactory.create(AppModule);

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
bootstrap();
