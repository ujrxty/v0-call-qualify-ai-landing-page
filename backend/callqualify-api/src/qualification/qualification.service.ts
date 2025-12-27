import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RulesService } from '../rules/rules.service';
import { CallStatus, RuleType } from '@prisma/client';

@Injectable()
export class QualificationService {
  private readonly logger = new Logger(QualificationService.name);

  constructor(
    private prisma: PrismaService,
    private rulesService: RulesService,
  ) {}

  /**
   * Evaluate a call's transcript against qualification rules
   */
  async evaluateCall(callId: string, userId: string): Promise<void> {
    this.logger.log(`Starting qualification evaluation for call ${callId}`);

    try {
      // Update call status
      await this.prisma.call.update({
        where: { id: callId },
        data: { status: CallStatus.EVALUATING },
      });

      // Get the transcript
      const call = await this.prisma.call.findUnique({
        where: { id: callId },
        include: {
          transcript: {
            include: {
              lines: {
                orderBy: { sequenceNumber: 'asc' },
              },
            },
          },
        },
      });

      if (!call || !call.transcript) {
        throw new Error('Call or transcript not found');
      }

      // Get active rules for this user
      const rules = await this.rulesService.getActiveRules(userId);

      if (rules.length === 0) {
        this.logger.warn(`No rules found for user ${userId}, skipping evaluation`);
        await this.prisma.call.update({
          where: { id: callId },
          data: { status: CallStatus.COMPLETED },
        });
        return;
      }

      // Evaluate each rule
      const ruleResults = [];
      for (const rule of rules) {
        const result = this.evaluateRule(rule, call.transcript, call.duration);
        ruleResults.push({
          ruleId: rule.id,
          passed: result.passed,
          confidence: result.confidence,
          explanation: result.explanation,
          matchedText: result.matchedText,
        });
      }

      // Calculate overall status
      const requiredRules = rules.filter((r) => r.isRequired);
      const requiredResults = ruleResults.filter((r) =>
        requiredRules.some((rule) => rule.id === r.ruleId)
      );

      const rulesPassed = ruleResults.filter((r) => r.passed).length;
      const rulesFailed = ruleResults.length - rulesPassed;
      const requiredPassed = requiredResults.every((r) => r.passed);

      const overallStatus = requiredPassed ? 'QUALIFIED' : 'DISQUALIFIED';
      const confidenceAvg =
        ruleResults.reduce((sum, r) => sum + r.confidence, 0) / ruleResults.length;

      // Create qualification result
      const qualification = await this.prisma.qualificationResult.create({
        data: {
          callId,
          overallStatus,
          confidenceAvg,
          rulesPassed,
          rulesFailed,
        },
      });

      // Create rule results
      await this.prisma.ruleResult.createMany({
        data: ruleResults.map((result) => ({
          ...result,
          qualificationId: qualification.id,
        })),
      });

      // Update call status to completed
      await this.prisma.call.update({
        where: { id: callId },
        data: { status: CallStatus.COMPLETED },
      });

      this.logger.log(
        `Qualification completed for call ${callId}: ${overallStatus} (${rulesPassed}/${ruleResults.length} rules passed)`,
      );
    } catch (error) {
      this.logger.error(`Qualification failed for call ${callId}:`, error);

      await this.prisma.call.update({
        where: { id: callId },
        data: {
          status: CallStatus.FAILED,
          errorMessage: `Qualification error: ${error.message}`,
        },
      });
    }
  }

  /**
   * Evaluate a single rule against a transcript
   */
  private evaluateRule(
    rule: any,
    transcript: any,
    callDuration: number,
  ): {
    passed: boolean;
    confidence: number;
    explanation: string;
    matchedText: string | null;
  } {
    switch (rule.type) {
      case RuleType.KEYWORD:
        return this.evaluateKeywordRule(rule, transcript);
      case RuleType.DURATION:
        return this.evaluateDurationRule(rule, callDuration);
      case RuleType.SPEAKER_TIME:
        return this.evaluateSpeakerTimeRule(rule, transcript);
      case RuleType.CUSTOM:
        return this.evaluateCustomRule(rule, transcript);
      default:
        return {
          passed: false,
          confidence: 0,
          explanation: `Unknown rule type: ${rule.type}`,
          matchedText: null,
        };
    }
  }

  /**
   * Evaluate keyword-based rule
   */
  private evaluateKeywordRule(rule: any, transcript: any) {
    const { keywords, speaker, position } = rule.criteria;
    const lines = transcript.lines;

    // Filter lines by speaker if specified
    let relevantLines = speaker
      ? lines.filter((line) => line.speaker === speaker)
      : lines;

    // Filter by position
    if (position === 'first_3_lines') {
      relevantLines = relevantLines.slice(0, 3);
    } else if (position === 'last_3_lines') {
      relevantLines = relevantLines.slice(-3);
    }

    // Check for keyword matches
    const fullText = relevantLines.map((l) => l.text.toLowerCase()).join(' ');
    const matches = keywords.filter((kw) =>
      fullText.includes(kw.toLowerCase()),
    );

    const passed = matches.length > 0;
    const confidence = passed ? 0.95 : 0.85;

    return {
      passed,
      confidence,
      explanation: passed
        ? `Found keyword(s): "${matches.join('", "')}"`
        : `Missing required keywords: "${keywords.join('", "')}"`,
      matchedText: passed ? matches[0] : null,
    };
  }

  /**
   * Evaluate duration-based rule
   */
  private evaluateDurationRule(rule: any, callDuration: number) {
    const { min_seconds, max_seconds } = rule.criteria;
    const durationSeconds = Math.floor(callDuration / 1000);

    let passed = true;
    let explanation = '';

    if (min_seconds && durationSeconds < min_seconds) {
      passed = false;
      explanation = `Call too short: ${durationSeconds}s (minimum: ${min_seconds}s)`;
    } else if (max_seconds && durationSeconds > max_seconds) {
      passed = false;
      explanation = `Call too long: ${durationSeconds}s (maximum: ${max_seconds}s)`;
    } else {
      explanation = `Call duration ${durationSeconds}s is within acceptable range`;
    }

    return {
      passed,
      confidence: 1.0,
      explanation,
      matchedText: `${durationSeconds}s`,
    };
  }

  /**
   * Evaluate speaker time ratio rule
   */
  private evaluateSpeakerTimeRule(rule: any, transcript: any) {
    const { speaker, min_percentage, max_percentage } = rule.criteria;
    const lines = transcript.lines;

    const speakerLines = lines.filter((line) => line.speaker === speaker);
    const speakerTime = speakerLines.reduce(
      (sum, line) => sum + (line.endTime - line.startTime),
      0,
    );
    const totalTime =
      lines[lines.length - 1].endTime - lines[0].startTime;
    const percentage = (speakerTime / totalTime) * 100;

    let passed = true;
    let explanation = '';

    if (min_percentage && percentage < min_percentage) {
      passed = false;
      explanation = `${speaker} spoke ${percentage.toFixed(1)}% (minimum: ${min_percentage}%)`;
    } else if (max_percentage && percentage > max_percentage) {
      passed = false;
      explanation = `${speaker} spoke ${percentage.toFixed(1)}% (maximum: ${max_percentage}%)`;
    } else {
      explanation = `${speaker} spoke ${percentage.toFixed(1)}% of the time`;
    }

    return {
      passed,
      confidence: 0.9,
      explanation,
      matchedText: `${percentage.toFixed(1)}%`,
    };
  }

  /**
   * Evaluate custom rule (placeholder for future expansion)
   */
  private evaluateCustomRule(rule: any, transcript: any) {
    return {
      passed: false,
      confidence: 0,
      explanation: 'Custom rules not yet implemented',
      matchedText: null,
    };
  }
}
