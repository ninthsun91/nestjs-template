import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Response } from 'express'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name)

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status: HttpStatus
    let message: string

    switch (exception.code) {
      // Unique constraint violation
      case 'P2002':
        status = HttpStatus.CONFLICT
        message = `Unique constraint failed on: ${(exception.meta?.target as string[]).join(', ')}`
        break

      // Record not found
      case 'P2025':
        status = HttpStatus.NOT_FOUND
        message = exception.message
        break

      // Foreign key constraint failed
      case 'P2003':
        status = HttpStatus.BAD_REQUEST
        message = `Foreign key constraint failed on field: ${exception.meta?.field_name as string}`
        break

      // Value too long for column type
      case 'P2000':
        status = HttpStatus.BAD_REQUEST
        message = `The provided value for ${exception.meta?.column_name as string} is too long`
        break

      // Required value missing
      case 'P2011':
      case 'P2012':
        status = HttpStatus.BAD_REQUEST
        message = exception.message
        break

      // Invalid input data
      case 'P2006':
        status = HttpStatus.BAD_REQUEST
        message = `Invalid value provided for: ${exception.meta?.field_name as string}`
        break

      // Database connection error
      case 'P2024':
        status = HttpStatus.SERVICE_UNAVAILABLE
        message = 'Database connection error'
        break

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR
        message = 'Internal server error'
    }

    this.logger.error(`${exception.name}[${exception.code}] ${exception.message}`)
    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
    })
  }
}
