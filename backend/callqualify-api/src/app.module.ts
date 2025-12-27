import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CallsModule } from './calls/calls.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { RulesModule } from './rules/rules.module';
import { QualificationModule } from './qualification/qualification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    CallsModule,
    TranscriptionModule,
    RulesModule,
    QualificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
