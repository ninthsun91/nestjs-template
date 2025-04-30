import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { loadEnv, EnvService } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadEnv],
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class CustomConfigModule {}
