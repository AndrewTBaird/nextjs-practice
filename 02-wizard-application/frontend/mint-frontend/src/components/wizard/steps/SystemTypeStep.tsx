'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';

type SystemTypeOption = 'split' | 'package' | 'dont-know';

const SYSTEM_TYPE_OPTIONS: { 
  value: SystemTypeOption; 
  label: string; 
  description: string;
  details: string[];
}[] = [
  {
    value: 'split',
    label: 'Split System',
    description: 'Indoor and outdoor units connected by refrigerant lines',
    details: [
      'Outdoor condenser unit',
      'Indoor air handler or furnace',
      'Connected by refrigerant lines'
    ]
  },
  {
    value: 'package',
    label: 'Package System',
    description: 'All components housed in a single outdoor unit',
    details: [
      'Single outdoor unit',
      'All components in one cabinet',
      'Connects to home via ductwork'
    ]
  },
  {
    value: 'dont-know',
    label: "I don't know",
    description: 'Not sure about my current system type',
    details: [
      'Our experts can help identify your system',
      'We\'ll provide guidance during consultation'
    ]
  }
];

export const SystemTypeStep: React.FC = () => {
  const { formData, updateFormData } = useWizard();
  const [selectedType, setSelectedType] = useState<SystemTypeOption | ''>(formData.systemType);

  useEffect(() => {
    updateFormData('systemType', selectedType);
  }, [selectedType]);

  const handleSelection = (value: SystemTypeOption) => {
    setSelectedType(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">
          What type of HVAC system do you currently have? This helps us recommend the right equipment and estimate installation requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {SYSTEM_TYPE_OPTIONS.map((option) => (
          <div key={option.value} className="relative">
            <label
              className={`
                relative flex p-6 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors
                ${selectedType === option.value 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
                }
              `}
            >
              <input
                type="radio"
                name="systemType"
                value={option.value}
                checked={selectedType === option.value}
                onChange={() => handleSelection(option.value)}
                className="sr-only"
              />
              
              {/* Radio Button */}
              <div className={`
                flex-shrink-0 w-4 h-4 rounded-full border-2 mr-4 mt-1
                ${selectedType === option.value 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }
              `}>
                {selectedType === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {option.description}
                    </p>
                    
                    {/* Details */}
                    <ul className="space-y-1">
                      {option.details.map((detail, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Illustration */}
                  <div className="flex-shrink-0 ml-6">
                    {option.value === 'split' && (
                      <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 4h18M4 4h16v5H4z" />
                        </svg>
                      </div>
                    )}
                    {option.value === 'package' && (
                      <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    {option.value === 'dont-know' && (
                      <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Need help identifying your system?</h4>
        <p className="text-sm text-gray-600 mb-3">
          Look outside your home. If you see a large unit with a fan on top, that's likely your outdoor condenser (split system). 
          If all the equipment is in one outdoor unit, it's probably a package system.
        </p>
        <div className="flex items-center text-sm text-blue-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Still not sure? Select "I don't know" and we'll help you identify your system.
        </div>
      </div>

      {/* Info Message for "Don't Know" */}
      {selectedType === 'dont-know' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                No worries! Our technical team will help identify your system type during the consultation. This ensures we provide the most accurate quote for your specific setup.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};