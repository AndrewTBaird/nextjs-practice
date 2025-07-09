'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext'

type HeatingTypeOption = 'heat-pump' | 'gas' | 'dont-know';

const HEATING_TYPE_OPTIONS: { 
  value: HeatingTypeOption; 
  label: string; 
  description: string;
  pros: string[];
  considerations: string[];
}[] = [
  {
    value: 'heat-pump',
    label: 'Heat Pump',
    description: 'Electric heating and cooling in one system',
    pros: [
      'Energy efficient',
      'Provides both heating and cooling',
      'Environmentally friendly'
    ],
    considerations: [
      'May need backup heat in extreme cold',
      'Higher upfront cost'
    ]
  },
  {
    value: 'gas',
    label: 'Gas Furnace',
    description: 'Natural gas heating with separate AC cooling',
    pros: [
      'Fast, powerful heating',
      'Lower operating costs in cold climates',
      'Reliable in extreme weather'
    ],
    considerations: [
      'Requires natural gas connection',
      'Separate system for cooling'
    ]
  },
  {
    value: 'dont-know',
    label: "I don't know",
    description: 'Not sure about my current heating type',
    pros: [
      'Our experts will help identify your system',
      'We\'ll recommend the best option for your home'
    ],
    considerations: []
  }
];

export const HeatingTypeStep: React.FC = () => {
  const { formData, updateFormData } = useWizard();
  const [selectedType, setSelectedType] = useState<HeatingTypeOption | ''>(formData.heatingType);

  useEffect(() => {
    updateFormData('heatingType', selectedType);
  }, [selectedType]);

  // Sync local state when formData changes (e.g., when going back)
  useEffect(() => {
    setSelectedType(formData.heatingType);
  }, [formData.heatingType]);

  const handleSelection = (value: HeatingTypeOption) => {
    setSelectedType(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">
          What type of heating system do you prefer? This helps us recommend the most suitable and efficient solution for your home.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {HEATING_TYPE_OPTIONS.map((option) => (
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
                name="heatingType"
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
                    <p className="text-sm text-gray-600 mb-4">
                      {option.description}
                    </p>
                    
                    {/* Pros */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {option.value === 'dont-know' ? 'Benefits:' : 'Advantages:'}
                      </h4>
                      <ul className="space-y-1">
                        {option.pros.map((pro, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Considerations */}
                    {option.considerations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Considerations:</h4>
                        <ul className="space-y-1">
                          {option.considerations.map((consideration, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L4.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};