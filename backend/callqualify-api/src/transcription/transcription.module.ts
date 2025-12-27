import { Module, forwardRef } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { QualificationModule } from '../qualification/qualification.module';

@Module({
  imports: [forwardRef(() => QualificationModule)],
  providers: [TranscriptionService],
  exports: [TranscriptionService],
})
export class TranscriptionModule {}
