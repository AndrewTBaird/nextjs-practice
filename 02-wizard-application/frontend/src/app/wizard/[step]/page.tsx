// app/wizard/[step]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WizardProvider } from '@/contexts/WizardContext';
import { WizardLayout } from '@/components/wizard/WizardLayout';

// Import your step components
import { AddressStep } from '@/components/wizard/steps/AddressStep';
import { ACUnitsStep } from '@/components/wizard/steps/ACUnitsStep';
import { SystemTypeStep } from '@/components/wizard/steps/SystemTypeStep';
import { HeatingTypeStep } from '@/components/wizard/steps/HeatingTypeStep';
import { ContactStep } from '@/components/wizard/steps/ContactStep';
import { ConfirmationStep } from '@/components/wizard/steps/ConfirmationStep';

// Define step configuration with components and metadata
const STEP_CONFIG = {
  'address': {
    component: AddressStep,
    title: 'Property Address',
    subtitle: 'Where would you like the HVAC system installed?'
  },
  'ac-units': {
    component: ACUnitsStep,
    title: 'AC Units',
    subtitle: 'How many AC units do you have?'
  },
  'system-type': {
    component: SystemTypeStep,
    title: 'System Type',
    subtitle: 'What type of HVAC system do you have?'
  },
  'heating-type': {
    component: HeatingTypeStep,
    title: 'Heating Type',
    subtitle: 'What type of heating system do you prefer?'
  },
  'contact-info': {
    component: ContactStep,
    title: 'Contact Information',
    subtitle: 'How can we reach you with your quote?'
  },
  'contact-only': {
    component: ContactStep,
    title: 'Contact Information',
    subtitle: 'We\'ll need to discuss your specific needs'
  },
  'confirmation': {
    component: ConfirmationStep,
    title: 'Quote Request Submitted',
    subtitle: 'Thank you for your submission!'
  }
} as const;

export default function WizardStepPage() {
  const params = useParams();
  const router = useRouter();
  const step = params.step as string;

  // Validate that the step exists in our configuration
  if (!step || !STEP_CONFIG[step as keyof typeof STEP_CONFIG]) {
    // If invalid step, redirect to the first step
    router.push('/wizard/address');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Redirecting...</span>
      </div>
    );
  }

  // Get the step configuration
  const stepConfig = STEP_CONFIG[step as keyof typeof STEP_CONFIG];
  const StepComponent = stepConfig.component;

  return (
    <WizardProvider>
      <WizardLayout 
        title={stepConfig.title}
        subtitle={stepConfig.subtitle}
      >
        <StepComponent />
      </WizardLayout>
    </WizardProvider>
  );
}