import { Module } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { RulesModule } from '../rules/rules.module';

@Module({
  imports: [RulesModule],
  providers: [QualificationService],
  exports: [QualificationService],
})
export class QualificationModule {}
