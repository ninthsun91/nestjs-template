import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigModule } from './config';

@Module({
  imports: [CustomConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
