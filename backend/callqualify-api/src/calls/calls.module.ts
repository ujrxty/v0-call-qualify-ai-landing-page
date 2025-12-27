import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
