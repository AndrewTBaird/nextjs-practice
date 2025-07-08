// src/types/wizard.ts

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
  | 'units' 
  | 'system-type' 
  | 'heating-type' 
  | 'contact-info' 
  | 'contact' 
  | 'confirmation';

export interface WizardState {
  sessionId: string;
  currentStep: WizardStep;
  formData: WizardData;
  completedSteps: WizardStep[];
  isLoading: boolean;
}

export interface WizardContextType extends WizardState {
  updateFormData: (step: keyof WizardData, data: any) => void;
  goToStep: (step: WizardStep) => void;
  goNext: () => void;
  goBack: () => void;
  canGoBack: () => boolean;
  canGoNext: () => boolean;
  getStepIndex: (step: WizardStep) => number;
  saveProgress: () => Promise<void>;
  submitWizard: () => Promise<void>;
}