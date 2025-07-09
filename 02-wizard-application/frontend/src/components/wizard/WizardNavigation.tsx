'use client';

import React from 'react';
import { useWizard } from '@/contexts/WizardContext';

export const WizardNavigation: React.FC = () => {
  const { 
    currentStep, 
    canGoBack, 
    canGoNext, 
    goBack, 
    goNext, 
    isLoading
  } = useWizard();

  const handleNext = async () => {
    goNext();
  };

  const getNextButtonText = () => {
    switch (currentStep) {
      case 'contact-only':
        return 'Complete Request';
      default:
        return 'Next';
    }
  };

  // Don't show navigation on confirmation page
  if (currentStep === 'confirmation') {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
      <div>
        {canGoBack() && (
          <button
            onClick={goBack}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
      </div>

      <div className="flex items-center">
        <button
          onClick={handleNext}
          disabled={!canGoNext() || isLoading}
          className="flex items-center px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {getNextButtonText()}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};