export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ContactData {
  name: string;
  phone: string;
  email: string;
}

export interface WizardData {
  address: AddressData;
  units: 'one' | 'two' | 'more-than-3' | 'dont-know' | '';
  systemType: 'split' | 'package' | 'dont-know' | '';
  heatingType: 'heat-pump' | 'gas' | 'dont-know' | '';
  contactInfo: ContactData;
}

export type WizardStep = 
  | 'address' 
  | 'ac-units' 
  | 'system-type' 
  | 'heating-type' 
  | 'contact-info' 
  | 'contact-only' 
  | 'confirmation';

export class NextStepRequestDto {
  sessionId: string;
  currentStep: WizardStep;
  formData: WizardData;
}

export class NextStepResponseDto {
  nextStep: WizardStep;
  sessionId: string;
}

export class SaveProgressRequestDto {
  sessionId: string;
  currentStep: WizardStep;
  formData: WizardData;
}

export class SaveProgressResponseDto {
  success: boolean;
  sessionId: string;
}

export class SubmitWizardRequestDto {
  sessionId: string;
  formData: WizardData;
}

export class SubmitWizardResponseDto {
  success: boolean;
  quoteRequestId: string;
}