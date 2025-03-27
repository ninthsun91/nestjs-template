import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './env';
import { EnvService } from './env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class CustomConfigModule {}
