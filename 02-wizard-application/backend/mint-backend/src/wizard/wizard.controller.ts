import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WizardService } from './wizard.service';
import { NextStepRequestDto, NextStepResponseDto, SaveProgressRequestDto, SaveProgressResponseDto, SubmitWizardRequestDto, SubmitWizardResponseDto } from './dto/wizard.dto';

@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  @Post('next-step')
  async determineNextStep(@Body() request: NextStepRequestDto): Promise<NextStepResponseDto> {
    return this.wizardService.determineNextStep(request);
  }

  @Post('save')
  async saveProgress(@Body() request: SaveProgressRequestDto): Promise<SaveProgressResponseDto> {
    return this.wizardService.saveProgress(request);
  }

  @Post('submit')
  async submitWizard(@Body() request: SubmitWizardRequestDto): Promise<SubmitWizardResponseDto> {
    return this.wizardService.submitWizard(request);
  }

  @Get('session/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    const session = await this.wizardService.getSession(sessionId);
    if (!session) {
      return { error: 'Session not found' };
    }
    return session;
  }
}
