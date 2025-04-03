import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppFilters, AppInterceptors, AppGuards } from './common'
import { AuthService } from './common/auth/auth.service'
import { LoggerModule } from './common/logger'
import { CustomConfigModule } from './config'
import { PrismaModule } from './prisma'

@Module({
  imports: [
    CustomConfigModule,
    LoggerModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    ...AppFilters,
    ...AppInterceptors,
    ...AppGuards,
  ],
})
export class AppModule {}
