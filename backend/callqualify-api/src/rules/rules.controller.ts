import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rules')
@UseGuards(JwtAuthGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  create(@Body() createRuleDto: CreateRuleDto, @Request() req) {
    return this.rulesService.create(req.user.userId, createRuleDto);
  }

  @Post('defaults')
  createDefaults(@Request() req) {
    return this.rulesService.createDefaultRules(req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.rulesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.rulesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
    @Request() req,
  ) {
    return this.rulesService.update(id, req.user.userId, updateRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.rulesService.remove(id, req.user.userId);
  }
}
