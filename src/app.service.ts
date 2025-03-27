import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { User } from 'src/types/user';

@Injectable()
export class AppService {
  private readonly users: User[] = [];

  healthCheck(): string {
    return 'OK';
  }

  createUser(name: string): User {
    const user = {
      id: randomUUID(),
      name,
    };
    this.users.push(user);

    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
