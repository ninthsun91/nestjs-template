import { randomUUID } from 'node:crypto'
import _ from 'lodash'
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import type { IncomingHttpHeaders } from 'node:http'
import type { AuthRequest, AuthResponse } from 'src/types/api'

const CONTEXT = 'APILogger'

@Injectable()
export class APILogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CONTEXT)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<AuthRequest>()
    if (request.url.includes('/health')) return next.handle()

    const now = Date.now()
    const requestId = randomUUID()

    this.logger.log(
      {
        type: 'req',
        id: requestId,
        time: now,
        method: request.method,
        url: request.url,
        headers: this.maskHeaders(request.headers),
        user: this.maskUser(request.user),
        body: this.maskRequestBody(request.body as object),
      },
      CONTEXT,
    )

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<AuthResponse>()
        const delay = Date.now() - now
        this.logger.log(
          {
            'type': 'res',
            'id': requestId,
            'method': request.method,
            'url': request.url,
            'status': response.statusCode,
            'content-length': response.get('content-length'),
            'delay': `${delay}ms`,
          },
          CONTEXT,
        )
      }),
    )
  }

  private maskHeaders(headers: IncomingHttpHeaders): IncomingHttpHeaders | null {
    if (headers.authorization) {
      const [type, token] = headers.authorization.split(' ')
      headers.authorization = `${type} access-token(length: ${token.length})`
    }
    return headers
  }

  private maskUser(user: AuthRequest['user'] | undefined): Record<string, unknown> | null {
    if (user === undefined) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }

  private maskRequestBody(body: object): Record<string, unknown> | null {
    if (!body) return null

    const clonedBody: Record<string, any> = _.cloneDeep(body)

    if (Buffer.isBuffer(body)) {
      return {
        type: 'Buffer',
        length: body.length,
      }
    }

    function recursiveMask(current: Record<string, unknown>) {
      Object.keys(current).forEach((key) => {
        if (keysToMask.has(key)) {
          current[key] = '**masked**'
        } else if (typeof current[key] === 'string' && isLikelyBase64(current[key])) {
          // Mask detected base64 string
          const originalLength = current[key].length
          current[key] = `**masked base64 (length: ${originalLength})**`
        } else if (typeof current[key] === 'object' && current[key] !== null) {
          recursiveMask(current[key] as Record<string, any>)
        }
      })
    }

    this.logger.debug(`clonedBody: ${JSON.stringify(clonedBody)}`)
    recursiveMask(clonedBody)
    return clonedBody
  }
}

const keysToMask: Set<string> = new Set(['password', 'access_token', 'accessToken', 'id_token'])

const BASE64_CHAR_REGEX = /^[A-Za-z0-9+/=]+$/

const isLikelyBase64 = (str: string): boolean => {
  const length = str.length
  if (length < 20) return false

  const sampleSize = 5
  const samples = [
    str.substring(0, sampleSize),
    str.substring(Math.floor(length / 2), Math.floor(length / 2) + sampleSize),
    str.substring(length - sampleSize),
  ]

  for (const sample of samples) {
    if (!BASE64_CHAR_REGEX.test(sample)) return false
  }

  // Base64 strings are multiples of 4 in length
  if (length % 4 !== 0) return false

  // Ultra-simplified entropy check - just check if first 15 chars have at least 6 unique chars
  // Avoids scanning the entire string
  const uniqueChars = new Set(str.substring(0, 15))
  return uniqueChars.size >= 6
}
