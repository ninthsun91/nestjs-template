import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { ServiceError } from './common/service-error'
import type { User } from 'src/types/user'

@Injectable()
export class AppService {
  private readonly users: User[] = []

  healthCheck(): string {
    return 'OK'
  }

  createUser(name: string): User {
    const user = {
      id: randomUUID(),
      name,
    }
    this.users.push(user)

    return user
  }

  getUser(id: string): User {
    const user = this.users.find(user => user.id === id)
    if (user === undefined) {
      throw UserError.UserNotFound('User not found')
    }

    return user
  }
}

export const UserErrorCode = {
  NOT_FOUND: 'USER_NOT_FOUND',
} as const
export type UserErrorCode = (typeof UserErrorCode)[keyof typeof UserErrorCode]

export class UserError extends ServiceError {
  static UserNotFound(message: string, cause?: Error) {
    return new UserError(message, {
      code: UserErrorCode.NOT_FOUND,
      cause,
    })
  }
}
