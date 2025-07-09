'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type UnitOption = 'one' | 'two' | 'more-than-3' | 'dont-know';

const UNIT_OPTIONS: { value: UnitOption; label: string; description: string }[] = [
  {
    value: 'one',
    label: '1 AC Unit',
    description: 'Single unit for your home'
  },
  {
    value: 'two',
    label: '2 AC Units',
    description: 'Two separate units or zones'
  },
  {
    value: 'more-than-3',
    label: 'More than 3 AC Units',
    description: 'Multiple units or complex system'
  },
  {
    value: 'dont-know',
    label: "I don't know",
    description: 'Not sure about my current setup'
  }
];

export const ACUnitsStep: React.FC = () => {
  const { formData, updateFormData } = useWizard();
  const [selectedUnits, setSelectedUnits] = useState<UnitOption | ''>(formData.units);

  useEffect(() => {
    updateFormData('units', selectedUnits);
  }, [selectedUnits]);

  // Sync local state when formData changes (e.g., when going back)
  useEffect(() => {
    setSelectedUnits(formData.units);
  }, [formData.units]);

  const handleSelection = (value: UnitOption) => {
    setSelectedUnits(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AC Units</CardTitle>
          <CardDescription>
            How many AC units do you currently have in your home? This helps us understand your system size and provide accurate pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedUnits}
            onValueChange={(value: UnitOption) => handleSelection(value)}
            className="space-y-4"
          >
            {UNIT_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="flex items-center justify-between cursor-pointer">
                    <div>
                      <h3 className="font-medium">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {option.value === 'one' && (
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {option.value === 'two' && (
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      )}
                      {option.value === 'more-than-3' && (
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {option.value === 'dont-know' && (
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Info Messages */}
      {selectedUnits === 'more-than-3' && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  For homes with more than 3 AC units, we&apos;ll need to discuss your specific needs. Our team will contact you to provide a customized quote.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedUnits === 'dont-know' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  No problem! Our experts can help you determine your current system setup. We&apos;ll contact you to discuss your home&apos;s cooling needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};