import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TranscriptionService } from '../transcription/transcription.service';
import { UploadCallDto } from './dto/upload-call.dto';
import { QueryCallsDto } from './dto/query-calls.dto';
import { CallStatus } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CallsService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    private prisma: PrismaService,
    private transcriptionService: TranscriptionService,
  ) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async uploadCall(
    file: Express.Multer.File,
    uploadCallDto: UploadCallDto,
    userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type (audio files only)
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/m4a',
      'audio/x-m4a',
      'audio/mp4',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: mp3, wav, m4a',
      );
    }

    // Build metadata
    const metadata: any = {
      ...(uploadCallDto.metadata || {}),
    };

    if (uploadCallDto.callerName) metadata.caller_name = uploadCallDto.callerName;
    if (uploadCallDto.callerPhone) metadata.caller_phone = uploadCallDto.callerPhone;
    if (uploadCallDto.agentName) metadata.agent_name = uploadCallDto.agentName;
    if (uploadCallDto.campaign) metadata.campaign = uploadCallDto.campaign;
    if (uploadCallDto.source) metadata.source = uploadCallDto.source;

    // Create call record
    const call = await this.prisma.call.create({
      data: {
        userId,
        recordingUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        fileSize: file.size,
        fileFormat: file.mimetype,
        status: CallStatus.PENDING,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      },
    });

    // Trigger transcription in background (non-blocking)
    this.transcriptionService.processCall(call.id).catch((error) => {
      console.error(`Background transcription failed for call ${call.id}:`, error);
    });

    return {
      success: true,
      data: call,
      message: 'Call uploaded successfully. Processing will begin shortly.',
    };
  }

  async getCalls(queryDto: QueryCallsDto, userId: string) {
    const { page = 1, limit = 20, status, search } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        {
          metadata: {
            path: ['caller_name'],
            string_contains: search,
          },
        },
      ];
    }

    const [calls, total] = await Promise.all([
      this.prisma.call.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          transcript: {
            select: {
              id: true,
              confidenceAvg: true,
            },
          },
          qualification: {
            select: {
              id: true,
              overallStatus: true,
              rulesPassed: true,
              rulesFailed: true,
            },
          },
        },
      }),
      this.prisma.call.count({ where }),
    ]);

    return {
      success: true,
      data: calls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCallById(callId: string, userId: string) {
    const call = await this.prisma.call.findFirst({
      where: {
        id: callId,
        userId,
      },
      include: {
        transcript: {
          include: {
            lines: {
              orderBy: { sequenceNumber: 'asc' },
            },
          },
        },
        qualification: {
          include: {
            ruleResults: {
              include: {
                rule: true,
              },
            },
          },
        },
      },
    });

    if (!call) {
      throw new NotFoundException('Call not found');
    }

    return {
      success: true,
      data: call,
    };
  }

  async deleteCall(callId: string, userId: string) {
    const call = await this.prisma.call.findFirst({
      where: {
        id: callId,
        userId,
      },
    });

    if (!call) {
      throw new NotFoundException('Call not found');
    }

    // Delete physical file
    if (call.recordingUrl && call.recordingUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), call.recordingUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn('Failed to delete file:', error);
      }
    }

    // Delete from database (cascade will handle related records)
    await this.prisma.call.delete({
      where: { id: callId },
    });

    return {
      success: true,
      message: 'Call deleted successfully',
    };
  }

  async getCallStats(userId: string) {
    const [total, pending, transcribing, evaluating, completed, failed] =
      await Promise.all([
        this.prisma.call.count({ where: { userId } }),
        this.prisma.call.count({
          where: { userId, status: CallStatus.PENDING },
        }),
        this.prisma.call.count({
          where: { userId, status: CallStatus.TRANSCRIBING },
        }),
        this.prisma.call.count({
          where: { userId, status: CallStatus.EVALUATING },
        }),
        this.prisma.call.count({
          where: { userId, status: CallStatus.COMPLETED },
        }),
        this.prisma.call.count({
          where: { userId, status: CallStatus.FAILED },
        }),
      ]);

    return {
      success: true,
      data: {
        total,
        pending,
        transcribing,
        evaluating,
        completed,
        failed,
      },
    };
  }
}
