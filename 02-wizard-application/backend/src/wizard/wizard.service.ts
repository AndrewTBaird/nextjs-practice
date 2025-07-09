import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WizardStep, WizardData, NextStepRequestDto, NextStepResponseDto, SubmitWizardRequestDto, SubmitWizardResponseDto } from './dto/wizard.dto';
import { WizardSession } from './entities/wizard-session.entity';
import { QuoteRequest } from './entities/quote-request.entity';

@Injectable()
export class WizardService {
  constructor(
    @InjectRepository(WizardSession)
    private wizardSessionRepository: Repository<WizardSession>,
    @InjectRepository(QuoteRequest)
    private quoteRequestRepository: Repository<QuoteRequest>,
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
    
    // Generate a quote request ID
    const quoteRequestId = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    // Save quote request to database
    const quoteRequest = this.quoteRequestRepository.create({
      quoteRequestId,
      sessionId,
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zipCode: formData.address.zipCode,
      units: formData.units,
      systemType: formData.systemType,
      heatingType: formData.heatingType,
      name: formData.contactInfo.name,
      phone: formData.contactInfo.phone,
      email: formData.contactInfo.email,
    });
    
    await this.quoteRequestRepository.save(quoteRequest);
    
    // Clear session after submission
    await this.wizardSessionRepository.delete({ sessionId });
    
    return {
      success: true,
      quoteRequestId
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
