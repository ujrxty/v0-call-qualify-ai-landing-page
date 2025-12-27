import { IsString, IsEnum, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { RuleType } from '@prisma/client';

export class CreateRuleDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(RuleType)
  type: RuleType;

  @IsObject()
  criteria: any; // JSON object with rule-specific criteria

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
