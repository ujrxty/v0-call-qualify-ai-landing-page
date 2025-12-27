import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadCallDto } from './dto/upload-call.dto';
import { QueryCallsDto } from './dto/query-calls.dto';

@Controller('calls')
@UseGuards(JwtAuthGuard)
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `call-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadCall(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadCallDto: UploadCallDto,
    @Request() req,
  ) {
    return this.callsService.uploadCall(file, uploadCallDto, req.user.userId);
  }

  @Get()
  async getCalls(@Query() queryDto: QueryCallsDto, @Request() req) {
    return this.callsService.getCalls(queryDto, req.user.userId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.callsService.getCallStats(req.user.userId);
  }

  @Get(':id')
  async getCall(@Param('id') id: string, @Request() req) {
    return this.callsService.getCallById(id, req.user.userId);
  }

  @Delete(':id')
  async deleteCall(@Param('id') id: string, @Request() req) {
    return this.callsService.deleteCall(id, req.user.userId);
  }
}
