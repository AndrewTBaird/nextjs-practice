import { Injectable } from '@nestjs/common';
import { WizardStep, WizardData, NextStepRequestDto, NextStepResponseDto, SaveProgressRequestDto, SaveProgressResponseDto, SubmitWizardRequestDto, SubmitWizardResponseDto } from './dto/wizard.dto';

@Injectable()
export class WizardService {
  private wizardSessions: Map<string, { currentStep: WizardStep; formData: WizardData }> = new Map();

  determineNextStep(request: NextStepRequestDto): NextStepResponseDto {
    const { sessionId, currentStep, formData } = request;
    
    // Save current progress
    this.wizardSessions.set(sessionId, { currentStep, formData });
    
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

  saveProgress(request: SaveProgressRequestDto): SaveProgressResponseDto {
    const { sessionId, currentStep, formData } = request;
    
    this.wizardSessions.set(sessionId, { currentStep, formData });
    
    return {
      success: true,
      sessionId
    };
  }

  submitWizard(request: SubmitWizardRequestDto): SubmitWizardResponseDto {
    const { sessionId, formData } = request;
    
    // TODO: Save to database and create quote request
    // For now, just generate a quote request ID
    const quoteRequestId = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    // Clear session after submission
    this.wizardSessions.delete(sessionId);
    
    return {
      success: true,
      quoteRequestId
    };
  }

  getSession(sessionId: string): { currentStep: WizardStep; formData: WizardData } | undefined {
    return this.wizardSessions.get(sessionId);
  }
}
