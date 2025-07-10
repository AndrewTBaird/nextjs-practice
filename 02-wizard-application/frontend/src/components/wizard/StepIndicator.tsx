'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Progress } from '@/components/ui/progress';

export const StepIndicator: React.FC = () => {
  const { currentStep } = useWizard();
  const [displayProgress, setDisplayProgress] = useState(0);

  // Get current step number for display
  const getCurrentStepNumber = () => {
    if (currentStep === 'address') return 1;
    if (currentStep === 'ac-units') return 2;
    if (currentStep === 'system-type') return 3;
    if (currentStep === 'heating-type') return 4;
    if (currentStep === 'contact-info' || currentStep === 'contact-only') return 5;
    if (currentStep === 'confirmation') return 5;
    return 1;
  };

  // Calculate progress based on current step position
  const calculateProgress = useCallback(() => {
    let stepNumber = 1;
    if (currentStep === 'address') stepNumber = 1;
    else if (currentStep === 'ac-units') stepNumber = 2;
    else if (currentStep === 'system-type') stepNumber = 3;
    else if (currentStep === 'heating-type') stepNumber = 4;
    else if (currentStep === 'contact-info' || currentStep === 'contact-only') stepNumber = 5;
    else if (currentStep === 'confirmation') stepNumber = 5;
    
    const totalSteps = 5;
    return (stepNumber / totalSteps) * 100;
  }, [currentStep]);

  // Update progress smoothly when step changes
  useEffect(() => {
    const targetProgress = calculateProgress();
    setDisplayProgress(targetProgress);
  }, [calculateProgress]);

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
          Step {getCurrentStepNumber()} of 5
        </span>
        <span className="text-sm font-medium text-primary">
          {getStepDisplayName(currentStep)}
        </span>
      </div>
      <Progress value={displayProgress} className="h-2" />
    </div>
  );
};