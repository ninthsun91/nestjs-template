import type { Request, Response } from 'express'
import type { User } from '@prisma/client'

export interface AuthRequest extends Request {
  user: User
}

export interface AuthResponse extends Response {}
