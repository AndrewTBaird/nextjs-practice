'use client';

import React from 'react';
import { useWizard } from '@/contexts/WizardContext'
import { WizardStep } from '@/types/wizard';

const STEP_CONFIG = [
  { key: 'address', label: 'Address', order: 1 },
  { key: 'units', label: 'AC Units', order: 2 },
  { key: 'system-type', label: 'System Type', order: 3 },
  { key: 'heating-type', label: 'Heating', order: 4 },
  { key: 'contact-info', label: 'Contact Info', order: 5 },
  { key: 'contact', label: 'Contact', order: 5 }, // Same order as contact-info
  { key: 'confirmation', label: 'Complete', order: 6 }
];

export const StepIndicator: React.FC = () => {
  const { currentStep, completedSteps, formData } = useWizard();

  // Filter steps based on user selections
  const getVisibleSteps = () => {
    const steps = [
      STEP_CONFIG.find(s => s.key === 'address')!,
      STEP_CONFIG.find(s => s.key === 'units')!,
    ];

    // Add subsequent steps based on selections
    if (formData.units === 'one' || formData.units === 'two') {
      steps.push(STEP_CONFIG.find(s => s.key === 'system-type')!);
      
      if (formData.systemType && formData.systemType !== 'dont-know') {
        steps.push(STEP_CONFIG.find(s => s.key === 'heating-type')!);
        
        if (formData.heatingType && formData.heatingType !== 'dont-know') {
          steps.push(STEP_CONFIG.find(s => s.key === 'contact-info')!);
        }
      }
    }

    // Add contact step if they selected any "don't know" options
    if (formData.units === 'more-than-3' || formData.units === 'dont-know' ||
        formData.systemType === 'dont-know' || formData.heatingType === 'dont-know') {
      steps.push(STEP_CONFIG.find(s => s.key === 'contact')!);
    }

    // Always add confirmation at the end
    steps.push(STEP_CONFIG.find(s => s.key === 'confirmation')!);

    return steps;
  };

  const visibleSteps = getVisibleSteps();

  const getStepStatus = (step: typeof STEP_CONFIG[0]) => {
    if (completedSteps.includes(step.key as WizardStep)) {
      return 'completed';
    }
    if (step.key === currentStep) {
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4">
      {visibleSteps.map((step, index) => {
        const status = getStepStatus(step);
        const isLast = index === visibleSteps.length - 1;

        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center">
              {/* Step Circle */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${status === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : status === 'current' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-2 hidden md:block">
                <p className={`text-sm font-medium ${
                  status === 'current' ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className={`
                w-8 md:w-12 h-0.5 
                ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};