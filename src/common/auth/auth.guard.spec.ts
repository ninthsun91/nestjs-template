import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthGuard } from './auth.guard'
import { Reflector } from '@nestjs/core'
import { AuthService } from './auth.service'
import { IgnoreAuthKey } from './ignore-auth.decorator'
import type { User } from '@prisma/client'
import type { Request } from 'express'

interface AuthRequest extends Request {
  user: User
}

describe('AuthGuard', () => {
  let authGuard: AuthGuard
  let reflector: Reflector
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            verifyAccessToken: jest.fn(),
          },
        },
      ],
    }).compile()

    reflector = moduleRef.get<Reflector>(Reflector)
    authGuard = moduleRef.get<AuthGuard>(AuthGuard)
    authService = moduleRef.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(authGuard).toBeDefined()
  })

  it('should ignore authentication if @IgnoreAuth is used', async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}) as Request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    // Mock reflector to return true for IgnoreAuthKey
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true)

    // Act
    const result = await authGuard.canActivate(mockContext)

    // Assert
    expect(result).toBe(true)
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IgnoreAuthKey, [
      mockContext.getHandler(),
      mockContext.getClass(),
    ])
  })

  it('should throw an UnauthorizedException if Authorization header is missing', async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            headers: {},
          }) as Request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    // Mock reflector to return false for IgnoreAuthKey
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false)

    // Act & Assert
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException())
  })

  it('should throw an UnauthorizedException if Authorization header is not a Bearer token', async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            headers: {
              authorization: 'Basic sometoken',
            },
          }) as Request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    // Mock reflector to return false for IgnoreAuthKey
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false)

    // Act & Assert
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException())
  })

  it('should throw an UnauthorizedException if user is not found', async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            headers: {
              authorization: 'Bearer validtoken',
            },
          }) as Request,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    // Mock reflector to return false for IgnoreAuthKey
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false)

    // Mock the verifyAccessToken method to throw an UnauthorizedException
    jest.spyOn(authService, 'verifyAccessToken').mockRejectedValueOnce(new UnauthorizedException('User not found'))

    // Act & Assert
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(new UnauthorizedException('User not found'))
    expect(authService.verifyAccessToken).toHaveBeenCalledWith('validtoken')
  })

  it('should add the user to the request if user is found', async () => {
    // Arrange
    const mockUser = { id: 1234, email: 'test@example.com', name: 'Test User' } as User
    const mockRequest = {
      headers: {
        authorization: 'Bearer validtoken',
      },
    } as Request

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext

    // Mock reflector to return false for IgnoreAuthKey
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false)

    // Mock the verifyAccessToken method to return a user
    jest.spyOn(authService, 'verifyAccessToken').mockResolvedValueOnce(mockUser)

    // Act
    const result = await authGuard.canActivate(mockContext)

    // Assert
    expect(result).toBe(true)
    expect(authService.verifyAccessToken).toHaveBeenCalledWith('validtoken')
    expect((mockRequest as AuthRequest).user).toEqual(mockUser)
  })
})
