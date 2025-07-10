'use client';

import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { ContactData } from '@/types/wizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ContactStep: React.FC = () => {
  const { formData, updateFormData, currentStep } = useWizard();
  const [contactInfo, setContactInfo] = useState<ContactData>(formData.contactInfo);
  const [errors, setErrors] = useState<Partial<ContactData>>({});

  // Determine if this is the "I don't know" flow
  const isConsultationFlow = currentStep === 'contact-only' || 
    formData.units === 'more-than-3' || 
    formData.units === 'dont-know' || 
    formData.systemType === 'dont-know' || 
    formData.heatingType === 'dont-know';

  // Only sync local state when formData changes (e.g., when going back)
  // But avoid circular updates by checking if the data is actually different
  useEffect(() => {
    const formDataStr = JSON.stringify(formData.contactInfo);
    const localStr = JSON.stringify(contactInfo);
    if (formDataStr !== localStr) {
      setContactInfo(formData.contactInfo);
    }
  }, [formData.contactInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update form data when local state changes (debounced to avoid excessive updates)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormData('contactInfo', contactInfo);
    }, 100);
    
    return () => clearTimeout(timeoutId);
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

  const getTitle = () => {
    return isConsultationFlow ? "Let's Get You Connected" : "Contact Information";
  };

  const getDescription = () => {
    if (isConsultationFlow) {
      return "We'll need to discuss your specific HVAC needs with one of our experts. Please provide your contact information and we'll reach out to you soon.";
    }
    return "How can we reach you with your personalized HVAC quote?";
  };

  const getInfoMessage = () => {
    if (isConsultationFlow) {
      return {
        bgColor: "bg-amber-50 border-amber-200",
        iconColor: "text-amber-400",
        textColor: "text-amber-800",
        message: "Our HVAC experts will call you within 2 business hours to discuss your specific needs and provide a customized quote. We're here to help find the perfect solution for your home."
      };
    }
    return {
      bgColor: "bg-green-50 border-green-200",
      iconColor: "text-green-400",
      textColor: "text-green-800",
      message: "Your information is secure and will only be used to provide your HVAC quote. We'll contact you within 24 hours with your personalized estimate."
    };
  };

  const infoMessage = getInfoMessage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
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
      <Card className={infoMessage.bgColor}>
        <CardContent className="pt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${infoMessage.iconColor}`} viewBox="0 0 20 20" fill="currentColor">
                {isConsultationFlow ? (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                )}
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm ${infoMessage.textColor}`}>
                {infoMessage.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};