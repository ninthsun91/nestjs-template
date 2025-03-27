import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppFilters } from './common';
import { CustomConfigModule } from './config';
import { PrismaModule } from './prisma';

@Module({
  imports: [CustomConfigModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, ...AppFilters],
})
export class AppModule {}
