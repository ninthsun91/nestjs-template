import fs from 'node:fs'
import path from 'node:path'
import { NestiaSwaggerComposer } from '@nestia/sdk'
import { NestFactory } from '@nestjs/core'
import { type NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from 'src/app.module'
import { LoggerService } from 'src/common/logger'

async function generateOpenApiSpec(): Promise<void> {
  const logger = new LoggerService({
    prefix: 'OpenAPI-Generator',
  })
  try {
    logger.log('Initializing application instance to generate OpenAPI spec')
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger,
    })

    const document = await NestiaSwaggerComposer.document(app, {
      openapi: '3.1',
      servers: [
        {
          url: 'https://my-service.com',
          description: 'Production',
        },
      ],
    })

    const outputPath = path.join(process.cwd(), 'swagger.json')
    fs.writeFileSync(
      outputPath,
      JSON.stringify(document, null, 2),
      { encoding: 'utf8' }
    )

    logger.log(`OpenAPI specification has been written to: ${outputPath}`)

    await app.close()
  } catch (error) {
    logger.error('Failed to generate OpenAPI specification', error)
    process.exit(1)
  }
}

if (require.main === module) {
  generateOpenApiSpec().catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })
}

export { generateOpenApiSpec }
