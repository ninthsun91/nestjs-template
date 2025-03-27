import { Global, Logger, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [Logger, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
