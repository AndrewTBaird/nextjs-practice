// src/components/wizard/WizardLayout.tsx
'use client';

import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { StepIndicator } from './StepIndicator';
import { WizardNavigation } from './WizardNavigation';

interface WizardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  const { isLoading } = useWizard();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HVAC Quote Request</h1>
              <p className="text-gray-600">Get your personalized quote in minutes</p>
            </div>
            <div className="hidden md:block">
              <StepIndicator />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Step Indicator */}
      <div className="md:hidden bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <StepIndicator />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Step Header */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>

          {/* Step Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Navigation */}
          <WizardNavigation />
        </div>
      </main>
    </div>
  );
};