import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WizardStep, WizardData, NextStepRequestDto, NextStepResponseDto, SubmitWizardRequestDto, SubmitWizardResponseDto } from './dto/wizard.dto';
import { WizardSession } from './entities/wizard-session.entity';
import { QuoteRequestService } from '../quote-request/quote-request.service';

@Injectable()
export class WizardService {
  constructor(
    @InjectRepository(WizardSession)
    private wizardSessionRepository: Repository<WizardSession>,
    private readonly quoteRequestService: QuoteRequestService,
  ) {}

  async determineNextStep(request: NextStepRequestDto): Promise<NextStepResponseDto> {
    const { sessionId, currentStep, formData } = request;
    
    // Save current progress to database
    await this.saveSessionToDatabase(sessionId, currentStep, formData);
    
    const nextStep = this.getNextStep(currentStep, formData);
    
    return {
      nextStep,
      sessionId
    };
  }

  private getNextStep(currentStep: WizardStep, formData: WizardData): WizardStep {
    switch (currentStep) {
      case 'address':
        return 'ac-units';
      case 'ac-units':
        if (formData.units === 'more-than-3' || formData.units === 'dont-know') {
          return 'contact-only';
        }
        return 'system-type';
      case 'system-type':
        if (formData.systemType === 'dont-know') {
          return 'contact-only';
        }
        return 'heating-type';
      case 'heating-type':
        if (formData.heatingType === 'dont-know') {
          return 'contact-only';
        }
        return 'contact-info';
      case 'contact-info':
        return 'confirmation';
      case 'contact-only':
        return 'confirmation';
      default:
        return 'address';
    }
  }


  async submitWizard(request: SubmitWizardRequestDto): Promise<SubmitWizardResponseDto> {
    const { sessionId, formData } = request;
    
    // Create quote request using the service
    const quoteResponse = await this.quoteRequestService.create({
      sessionId,
      formData
    });
    
    // Clear session after submission
    await this.wizardSessionRepository.delete({ sessionId });
    
    return {
      success: quoteResponse.success,
      quoteRequestId: quoteResponse.quoteRequestId
    };
  }

  async getSession(sessionId: string): Promise<{ currentStep: WizardStep; formData: WizardData } | undefined> {
    const session = await this.wizardSessionRepository.findOne({
      where: { sessionId }
    });
    
    if (!session) {
      return undefined;
    }
    
    return {
      currentStep: session.currentStep,
      formData: JSON.parse(session.formData)
    };
  }

  private async saveSessionToDatabase(sessionId: string, currentStep: WizardStep, formData: WizardData): Promise<void> {
    const existingSession = await this.wizardSessionRepository.findOne({
      where: { sessionId }
    });

    if (existingSession) {
      existingSession.currentStep = currentStep;
      existingSession.formData = JSON.stringify(formData);
      await this.wizardSessionRepository.save(existingSession);
    } else {
      const newSession = this.wizardSessionRepository.create({
        sessionId,
        currentStep,
        formData: JSON.stringify(formData)
      });
      await this.wizardSessionRepository.save(newSession);
    }
  }
}
