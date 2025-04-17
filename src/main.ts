import { NestiaSwaggerComposer } from '@nestia/sdk'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, type OpenAPIObject } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { LoggerService } from './common/logger'
import { API_VERSION, GLOBAL_PREFIX } from './config/constants'
import { EnvService } from './config/service'

async function bootstrap() {
  const logger = new LoggerService({
    prefix: 'MyApp',
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  })

  const envService = app.get(EnvService)
  const port = envService.get('port')

  const document = await NestiaSwaggerComposer.document(app, {
    openapi: '3.1',
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local',
      },
    ],
  })
  SwaggerModule.setup('doc', app, document as OpenAPIObject)

  app.setGlobalPrefix(GLOBAL_PREFIX)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  })
  app.enableCors({
    origin: true,
    credentials: true,
  })
  app.useBodyParser('json', {
    limit: '100mb',
  })
  app.use(helmet())
  app.use(cookieParser())

  await app.listen(port)
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap')
}
bootstrap().catch((error) => {
  const logger = new LoggerService()
  if (error instanceof Error && error.stack) {
    logger.error('Failed to start application', 'Bootstrap', error.stack)
  } else {
    logger.error('Failed to start application', 'Bootstrap')
  }
  process.exit(1)
})
