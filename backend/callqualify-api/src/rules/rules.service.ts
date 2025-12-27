import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createRuleDto: CreateRuleDto) {
    const rule = await this.prisma.rule.create({
      data: {
        ...createRuleDto,
        userId,
      },
    });

    return {
      success: true,
      data: rule,
      message: 'Rule created successfully',
    };
  }

  async findAll(userId: string) {
    const rules = await this.prisma.rule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: rules,
    };
  }

  async findOne(id: string, userId: string) {
    const rule = await this.prisma.rule.findFirst({
      where: { id, userId },
    });

    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    return {
      success: true,
      data: rule,
    };
  }

  async update(id: string, userId: string, updateRuleDto: UpdateRuleDto) {
    await this.findOne(id, userId); // Check existence

    const rule = await this.prisma.rule.update({
      where: { id },
      data: updateRuleDto,
    });

    return {
      success: true,
      data: rule,
      message: 'Rule updated successfully',
    };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check existence

    await this.prisma.rule.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Rule deleted successfully',
    };
  }

  /**
   * Get all active rules for a user for evaluation
   */
  async getActiveRules(userId: string) {
    return this.prisma.rule.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Create default rules for new users
   */
  async createDefaultRules(userId: string) {
    const defaultRules = [
      {
        name: 'Proper Greeting',
        description: 'Agent must greet the customer professionally',
        type: 'KEYWORD' as const,
        criteria: {
          keywords: ['hello', 'hi', 'good morning', 'good afternoon', 'good evening'],
          speaker: 'AGENT',
          position: 'first_3_lines',
        },
        isRequired: true,
      },
      {
        name: 'Mandatory Disclosure',
        description: 'Agent must disclose call recording',
        type: 'KEYWORD' as const,
        criteria: {
          keywords: ['recorded', 'recording', 'record this call'],
          speaker: 'AGENT',
          position: 'anywhere',
        },
        isRequired: true,
      },
      {
        name: 'Product Mentioned',
        description: 'Agent must mention the product or service',
        type: 'KEYWORD' as const,
        criteria: {
          keywords: ['product', 'service', 'offer', 'solution', 'plan'],
          speaker: 'AGENT',
          position: 'anywhere',
        },
        isRequired: true,
      },
      {
        name: 'Minimum Call Duration',
        description: 'Call must be at least 30 seconds',
        type: 'DURATION' as const,
        criteria: {
          min_seconds: 30,
        },
        isRequired: true,
      },
      {
        name: 'Professional Closing',
        description: 'Agent must close the call professionally',
        type: 'KEYWORD' as const,
        criteria: {
          keywords: ['thank you', 'thanks', 'have a great day', 'good day', 'talk soon'],
          speaker: 'AGENT',
          position: 'last_3_lines',
        },
        isRequired: false,
      },
    ];

    await this.prisma.rule.createMany({
      data: defaultRules.map((rule) => ({
        ...rule,
        userId,
      })),
    });

    return defaultRules.length;
  }
}
