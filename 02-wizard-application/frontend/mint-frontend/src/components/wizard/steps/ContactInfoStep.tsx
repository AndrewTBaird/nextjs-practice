'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { ContactData } from '@/types/wizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ContactInfoStep: React.FC = () => {
  const { formData, updateFormData } = useWizard();
  const [contactInfo, setContactInfo] = useState<ContactData>(formData.contactInfo);
  const [errors, setErrors] = useState<Partial<ContactData>>({});

  useEffect(() => {
    updateFormData('contactInfo', contactInfo);
  }, [contactInfo, updateFormData]);

  const validateField = (field: keyof ContactData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else {
          delete newErrors.name;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof ContactData, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleInputBlur = (field: keyof ContactData, value: string) => {
    validateField(field, value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            How can we reach you with your personalized HVAC quote?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={contactInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={(e) => handleInputBlur('name', e.target.value)}
              placeholder="John Doe"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={(e) => handleInputBlur('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={(e) => handleInputBlur('email', e.target.value)}
                placeholder="john@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Your information is secure and will only be used to provide your HVAC quote. We'll contact you within 24 hours with your personalized estimate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};