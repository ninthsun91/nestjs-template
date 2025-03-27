import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('should return "OK"', () => {
      expect(appController.getHealthCheck()).toBe('OK');
    });
  });

  describe('createUser', () => {
    it('should create a user', () => {
      const user = appController.postUser({ name: 'John Doe' });
      expect(user).toBeDefined();
      expect(user.name).toBe('John Doe');
    });
  });

  describe('getUser', () => {
    it('should return a user', () => {
      const userName = 'John Doe';
      const createUser = appController.postUser({ name: userName });

      const user = appController.getUser(createUser.id);
      expect(user).toBeDefined();
      expect(user.name).toBe(userName);
    });

    it('should throw a NotFoundException if the user does not exist', () => {
      expect(() => appController.getUser('1')).toThrow(NotFoundException);
    });
  });
});
