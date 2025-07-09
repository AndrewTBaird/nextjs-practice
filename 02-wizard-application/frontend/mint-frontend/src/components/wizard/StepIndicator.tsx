'use client';

import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Progress } from '@/components/ui/progress';

export const StepIndicator: React.FC = () => {
  const { currentStep } = useWizard();

  // Define all possible steps in order (matches the actual flow)
  const stepOrder = [
    'address',
    'ac-units',
    'system-type', 
    'heating-type',
    'contact-info',
    'contact-only',
    'confirmation'
  ];

  // Get current step index
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const maxSteps = 6; // Typical flow has 6 steps (excluding confirmation as final)
  
  // Calculate progress percentage based on current step position
  const progressPercentage = currentStepIndex >= 0 ? ((currentStepIndex + 1) / maxSteps) * 100 : 0;

  // Get current step display name
  const getStepDisplayName = (step: string) => {
    switch (step) {
      case 'address': return 'Address';
      case 'ac-units': return 'AC Units';
      case 'system-type': return 'System Type';
      case 'heating-type': return 'Heating Type';
      case 'contact-info': return 'Contact Info';
      case 'contact-only': return 'Contact Info';
      case 'confirmation': return 'Complete';
      default: return 'Progress';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {Math.max(currentStepIndex + 1, 1)} of {maxSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {getStepDisplayName(currentStep)}
        </span>
      </div>
      <Progress value={Math.max(progressPercentage, 0)} className="h-2" />
    </div>
  );
};