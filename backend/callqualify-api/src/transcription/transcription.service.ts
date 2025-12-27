import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QualificationService } from '../qualification/qualification.service';
import { CallStatus } from '@prisma/client';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => QualificationService))
    private qualificationService: QualificationService,
  ) {}

  /**
   * Mock transcription templates for realistic call scenarios
   */
  private readonly mockTranscriptTemplates = [
    // Template 1: Lead Qualification Call
    [
      { speaker: 'AGENT', text: "Good morning, this is Sarah from CallQualify AI. Am I speaking with John?" },
      { speaker: 'CUSTOMER', text: "Yes, this is John speaking." },
      { speaker: 'AGENT', text: "Great! I'm calling regarding your inquiry about our lead qualification service. Do you have a few minutes to discuss?" },
      { speaker: 'CUSTOMER', text: "Sure, I have some time." },
      { speaker: 'AGENT', text: "Perfect. As required by law, I need to inform you that this call is being recorded for quality and training purposes. Are you comfortable continuing?" },
      { speaker: 'CUSTOMER', text: "Yes, that's fine." },
      { speaker: 'AGENT', text: "Excellent. So our AI-powered system can help you automatically transcribe and qualify your sales calls. The main benefit is saving your team hours of manual work." },
      { speaker: 'CUSTOMER', text: "That sounds interesting. How does it work exactly?" },
      { speaker: 'AGENT', text: "Our system uses advanced AI to transcribe calls in real-time, then automatically checks them against your qualification criteria. For example, we verify proper disclosures, product mentions, and compliance requirements." },
      { speaker: 'CUSTOMER', text: "I see. What's the pricing like?" },
      { speaker: 'AGENT', text: "We offer flexible pricing starting at $99 per month for up to 100 calls. Would you like me to send over our detailed pricing sheet?" },
      { speaker: 'CUSTOMER', text: "Yes, please send that over. I'll discuss with my team." },
      { speaker: 'AGENT', text: "Perfect! I'll email that to you right away. Is there anything else I can help clarify?" },
      { speaker: 'CUSTOMER', text: "No, that covers it for now. Thanks!" },
      { speaker: 'AGENT', text: "Great! Thank you for your time, John. Have a wonderful day!" },
    ],

    // Template 2: Product Demo Call
    [
      { speaker: 'AGENT', text: "Hi, this is Michael from CallQualify. How are you today?" },
      { speaker: 'CUSTOMER', text: "I'm doing well, thanks." },
      { speaker: 'AGENT', text: "Wonderful! I'm calling to follow up on your demo request. This call will be recorded for quality purposes." },
      { speaker: 'CUSTOMER', text: "Okay, sounds good." },
      { speaker: 'AGENT', text: "So you mentioned you're currently handling about 200 sales calls per week. Is that correct?" },
      { speaker: 'CUSTOMER', text: "Yes, that's right. We're struggling to review them all." },
      { speaker: 'AGENT', text: "That's exactly the problem we solve. Our CallQualify platform can automatically transcribe and analyze all those calls, checking for quality metrics and compliance." },
      { speaker: 'CUSTOMER', text: "What kind of metrics do you track?" },
      { speaker: 'AGENT', text: "We track everything from proper greetings, mandatory disclosures, product mentions, objection handling, and closing techniques. Plus, you can create custom rules." },
      { speaker: 'CUSTOMER', text: "Custom rules would be really helpful for our specific process." },
      { speaker: 'AGENT', text: "Absolutely! Our rule engine is very flexible. Would you like to schedule a technical demo with our team?" },
      { speaker: 'CUSTOMER', text: "Yes, I'd like that." },
      { speaker: 'AGENT', text: "Perfect! I'll have our solutions engineer reach out to set that up. Anything else?" },
      { speaker: 'CUSTOMER', text: "No, that's all for now." },
      { speaker: 'AGENT', text: "Great chatting with you. Talk soon!" },
    ],

    // Template 3: Support/Inquiry Call
    [
      { speaker: 'AGENT', text: "Thank you for calling CallQualify support. This is Lisa. How can I help you today?" },
      { speaker: 'CUSTOMER', text: "Hi, I'm having trouble uploading audio files to the system." },
      { speaker: 'AGENT', text: "I'm sorry to hear that. This call is being recorded. Let me help you troubleshoot. What error are you seeing?" },
      { speaker: 'CUSTOMER', text: "It says the file format is not supported." },
      { speaker: 'AGENT', text: "Got it. Our system currently supports MP3, WAV, and M4A formats. What format is your file?" },
      { speaker: 'CUSTOMER', text: "Oh, it's a WMA file." },
      { speaker: 'AGENT', text: "That explains it. WMA files aren't supported yet, but you can easily convert them using free tools like Audacity. Would you like me to send you a quick guide?" },
      { speaker: 'CUSTOMER', text: "Yes please, that would be helpful." },
      { speaker: 'AGENT', text: "Perfect! I'll email that to you right away. Is there anything else I can assist with?" },
      { speaker: 'CUSTOMER', text: "No, that should do it. Thanks!" },
      { speaker: 'AGENT', text: "You're welcome! Have a great day!" },
    ],
  ];

  /**
   * Process a call and generate mock transcription
   */
  async processCall(callId: string): Promise<void> {
    this.logger.log(`Starting mock transcription for call ${callId}`);

    try {
      // Update call status to TRANSCRIBING
      await this.prisma.call.update({
        where: { id: callId },
        data: { status: CallStatus.TRANSCRIBING },
      });

      // Simulate processing delay (1-2 seconds)
      await this.delay(1000 + Math.random() * 1000);

      // Select random transcript template
      const template = this.getRandomTemplate();

      // Generate transcript lines with realistic timing
      const lines = this.generateTranscriptLines(template);

      // Calculate total duration
      const duration = lines[lines.length - 1].endTime;

      // Create transcript record
      const transcript = await this.prisma.transcript.create({
        data: {
          callId,
          confidenceAvg: this.randomBetween(0.85, 0.98),
          language: 'en-US',
          speakersCount: 2,
          processingTime: Math.floor(1000 + Math.random() * 2000),
        },
      });

      // Create transcript lines
      await this.prisma.transcriptLine.createMany({
        data: lines.map((line, index) => ({
          transcriptId: transcript.id,
          sequenceNumber: index + 1,
          speaker: line.speaker,
          text: line.text,
          startTime: line.startTime,
          endTime: line.endTime,
          confidence: line.confidence,
        })),
      });

      // Update call with duration
      const call = await this.prisma.call.update({
        where: { id: callId },
        data: {
          duration,
        },
        include: {
          user: true,
        },
      });

      this.logger.log(`Mock transcription completed for call ${callId}`);

      // Trigger qualification evaluation in background
      this.qualificationService
        .evaluateCall(callId, call.userId)
        .catch((error) => {
          this.logger.error(`Qualification evaluation failed for call ${callId}:`, error);
        });
    } catch (error) {
      this.logger.error(`Transcription failed for call ${callId}:`, error);

      await this.prisma.call.update({
        where: { id: callId },
        data: {
          status: CallStatus.FAILED,
          errorMessage: error.message,
        },
      });
    }
  }

  /**
   * Get random transcript template
   */
  private getRandomTemplate(): Array<{ speaker: string; text: string }> {
    const index = Math.floor(Math.random() * this.mockTranscriptTemplates.length);
    return this.mockTranscriptTemplates[index];
  }

  /**
   * Generate transcript lines with realistic timing and confidence
   */
  private generateTranscriptLines(
    template: Array<{ speaker: string; text: string }>,
  ): Array<{
    speaker: string;
    text: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }> {
    const lines = [];
    let currentTime = 0;

    for (const line of template) {
      // Calculate duration based on text length (roughly 150 words per minute)
      const wordCount = line.text.split(' ').length;
      const duration = Math.floor((wordCount / 150) * 60 * 1000); // in milliseconds

      // Add natural pause between speakers (0.5-2 seconds)
      const pause = Math.floor(500 + Math.random() * 1500);
      currentTime += pause;

      const startTime = currentTime;
      const endTime = currentTime + duration;

      lines.push({
        speaker: line.speaker,
        text: line.text,
        startTime,
        endTime,
        confidence: this.randomBetween(0.8, 0.99),
      });

      currentTime = endTime;
    }

    return lines;
  }

  /**
   * Generate random number between min and max
   */
  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Batch process multiple calls
   */
  async batchProcessCalls(callIds: string[]): Promise<void> {
    this.logger.log(`Starting batch transcription for ${callIds.length} calls`);

    // Process calls sequentially to avoid overwhelming the system
    for (const callId of callIds) {
      await this.processCall(callId);
    }

    this.logger.log(`Batch transcription completed for ${callIds.length} calls`);
  }
}
