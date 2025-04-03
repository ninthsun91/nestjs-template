import {
  Logger,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IgnoreAuthKey } from './ignore-auth.decorator'
import { AuthService } from './auth.service'
import type { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route has @IgnoreAuth decorator
    const isIgnored = this.getIgnoreMetadata(context)
    if (isIgnored) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()

    try {
      const accessToken = this.extractAccessToken(request)

      const user = await this.auth.verifyAccessToken(accessToken)

      Object.assign(request, { user })
      return true
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      this.logger.error('Unknown logger error')
      throw new InternalServerErrorException()
    }
  }

  private getIgnoreMetadata(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IgnoreAuthKey, [context.getHandler(), context.getClass()])
  }

  private extractAccessToken(request: Request): string {
    const authorization = request.headers.authorization

    if (!authorization) {
      this.logger.debug('Missing authorization header')
      throw new UnauthorizedException()
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException()
    }

    return authorization.split(' ')[1]
  }
}
