import { Injectable } from '@nestjs/common'
import { ServiceError } from '../service-error'
import type { User } from '@prisma/client'

// TODO: replace with your own error class for auth service
export class AuthError extends ServiceError {}

// TODO: replace with your own auth service
@Injectable()
export class AuthService {
  async verifyAccessToken(accessToken: string): Promise<User> {
    try {
      return {
        id: 1234,
        email: 'test@test.com',
        name: 'Test User',
      }
    } catch (error) {
      throw new AuthError('Invalid access token')
    }
  }
}
