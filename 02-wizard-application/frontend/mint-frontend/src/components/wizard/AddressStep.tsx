'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { AddressData } from '@/types/wizard';

export const AddressStep: React.FC = () => {
  const { formData, updateFormData } = useWizard();
  const [address, setAddress] = useState<AddressData>(formData.address);
  const [errors, setErrors] = useState<Partial<AddressData>>({});

  useEffect(() => {
    updateFormData('address', address);
  }, [address, updateFormData]);

  const validateField = (field: keyof AddressData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'street':
        if (!value.trim()) {
          newErrors.street = 'Street address is required';
        } else {
          delete newErrors.street;
        }
        break;
      case 'city':
        if (!value.trim()) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;
      case 'state':
        if (!value.trim()) {
          newErrors.state = 'State is required';
        } else {
          delete newErrors.state;
        }
        break;
      case 'zipCode':
        if (!value.trim()) {
          newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          newErrors.zipCode = 'Please enter a valid ZIP code';
        } else {
          delete newErrors.zipCode;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleInputBlur = (field: keyof AddressData, value: string) => {
    validateField(field, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600 mb-6">
          Please provide your address so we can give you an accurate quote for your area.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Street Address */}
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="street"
            value={address.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            onBlur={(e) => handleInputBlur('street', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.street ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="123 Main Street"
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-600">{errors.street}</p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={address.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={(e) => handleInputBlur('city', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.city ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Austin"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              id="state"
              value={address.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onBlur={(e) => handleInputBlur('state', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.state ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">Select State</option>
              <option value="TX">Texas</option>
              <option value="NV">Nevada</option>
              <option value="AZ">Arizona</option>
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
        </div>

        {/* ZIP Code */}
        <div className="md:w-1/3">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            value={address.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            onBlur={(e) => handleInputBlur('zipCode', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="78701"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              We currently service Texas, Nevada, and Arizona. Your quote will be customized based on your location and local installation requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};