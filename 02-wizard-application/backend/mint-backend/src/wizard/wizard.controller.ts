import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { WizardService } from './wizard.service';
import { NextStepRequestDto, NextStepResponseDto, SaveProgressRequestDto, SaveProgressResponseDto, SubmitWizardRequestDto, SubmitWizardResponseDto } from './dto/wizard.dto';

@Controller('wizard')
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  @Post('next-step')
  determineNextStep(@Body() request: NextStepRequestDto): NextStepResponseDto {
    return this.wizardService.determineNextStep(request);
  }

  @Post('save')
  saveProgress(@Body() request: SaveProgressRequestDto): SaveProgressResponseDto {
    return this.wizardService.saveProgress(request);
  }

  @Post('submit')
  submitWizard(@Body() request: SubmitWizardRequestDto): SubmitWizardResponseDto {
    return this.wizardService.submitWizard(request);
  }

  @Get('session/:sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    const session = this.wizardService.getSession(sessionId);
    if (!session) {
      return { error: 'Session not found' };
    }
    return session;
  }
}
