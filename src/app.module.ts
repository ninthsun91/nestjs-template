import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppFilters, AppInterceptors } from './common';
import { CustomConfigModule } from './config';
import { LoggerModule } from './common/logger';
import { PrismaModule } from './prisma';

@Module({
  imports: [CustomConfigModule, LoggerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, ...AppFilters, ...AppInterceptors],
})
export class AppModule {}
