import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { TranscriptionModule } from '../transcription/transcription.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TranscriptionModule,
  ],
  controllers: [CallsController],
  providers: [CallsService],
  exports: [CallsService],
})
export class CallsModule {}
