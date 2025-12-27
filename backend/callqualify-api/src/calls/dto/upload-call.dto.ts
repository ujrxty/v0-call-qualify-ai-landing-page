import { IsOptional, IsString, IsObject } from 'class-validator';

export class UploadCallDto {
  @IsString()
  @IsOptional()
  callerName?: string;

  @IsString()
  @IsOptional()
  callerPhone?: string;

  @IsString()
  @IsOptional()
  agentName?: string;

  @IsString()
  @IsOptional()
  campaign?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
