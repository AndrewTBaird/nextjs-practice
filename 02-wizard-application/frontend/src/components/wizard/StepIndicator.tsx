'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Progress } from '@/components/ui/progress';

export const StepIndicator: React.FC = () => {
  const { currentStep, formData } = useWizard();
  const [displayProgress, setDisplayProgress] = useState(0);

  // Calculate the logical progress based on form completion
  const calculateProgress = useCallback(() => {
    let progress = 0;
    
    // Address step (20%)
    if (formData.address.street && formData.address.city && formData.address.state && formData.address.zipCode) {
      progress += 20;
    }
    
    // AC Units step (20%)
    if (formData.units) {
      progress += 20;
      
      // If going to consultation flow, jump to 80% (skip system and heating)
      if (formData.units === 'more-than-3' || formData.units === 'dont-know') {
        progress = 80;
      }
    }
    
    // System Type step (20%) - only if in main flow
    if (formData.systemType && formData.units !== 'more-than-3' && formData.units !== 'dont-know') {
      progress += 20;
      
      // If going to consultation flow from system step
      if (formData.systemType === 'dont-know') {
        progress = 80;
      }
    }
    
    // Heating Type step (20%) - only if in main flow
    if (formData.heatingType && formData.systemType !== 'dont-know' && formData.units !== 'more-than-3' && formData.units !== 'dont-know') {
      progress += 20;
      
      // If going to consultation flow from heating step
      if (formData.heatingType === 'dont-know') {
        progress = 80;
      }
    }
    
    // Contact step (20%) - final step before confirmation
    if (formData.contactInfo.name && formData.contactInfo.phone && formData.contactInfo.email) {
      progress = 100;
    }
    
    // Confirmation step
    if (currentStep === 'confirmation') {
      progress = 100;
    }
    
    return Math.min(progress, 100);
  }, [currentStep, formData]);

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

  // Get current step number for display
  const getCurrentStepNumber = () => {
    if (currentStep === 'confirmation') return 5;
    if (currentStep === 'contact-only' || currentStep === 'contact-info') return 4;
    if (currentStep === 'heating-type') return 4;
    if (currentStep === 'system-type') return 3;
    if (currentStep === 'ac-units') return 2;
    if (currentStep === 'address') return 1;
    return 1;
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