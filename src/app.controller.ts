import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import type { User, CreateUserRequest } from 'src/types/user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TypedRoute.Get('/health')
  getHealthCheck(): string {
    return this.appService.healthCheck();
  }

  @TypedRoute.Post('/user')
  postUser(@TypedBody() body: CreateUserRequest): User {
    return this.appService.createUser(body.name);
  }

  @TypedRoute.Get('/user/:id')
  getUser(@TypedParam('id') id: string): User {
    const user = this.appService.getUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
