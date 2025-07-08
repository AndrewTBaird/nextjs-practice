'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { AddressData } from '@/types/wizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AddressStep: React.FC = () => {
  const { formData, updateFormData } = useWizard();
  const [address, setAddress] = useState<AddressData>(formData.address);
  const [errors, setErrors] = useState<Partial<AddressData>>({});

  useEffect(() => {
    updateFormData('address', address);
  }, [address]);

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
      <Card>
        <CardHeader>
          <CardTitle>Property Address</CardTitle>
          <CardDescription>
            Please provide your address so we can give you an accurate quote for your area.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={address.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              onBlur={(e) => handleInputBlur('street', e.target.value)}
              placeholder="123 Main Street"
              className={errors.street ? 'border-destructive' : ''}
            />
            {errors.street && (
              <p className="text-sm text-destructive">{errors.street}</p>
            )}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={(e) => handleInputBlur('city', e.target.value)}
                placeholder="Austin"
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={address.state}
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="NV">Nevada</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state}</p>
              )}
            </div>
          </div>

          {/* ZIP Code */}
          <div className="space-y-2 md:w-1/3">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={address.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              onBlur={(e) => handleInputBlur('zipCode', e.target.value)}
              placeholder="78701"
              className={errors.zipCode ? 'border-destructive' : ''}
            />
            {errors.zipCode && (
              <p className="text-sm text-destructive">{errors.zipCode}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
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
                We currently service Texas, Nevada, and Arizona. Your quote will be customized based on your location and local installation requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};