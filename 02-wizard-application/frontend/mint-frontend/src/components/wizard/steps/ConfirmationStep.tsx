'use client';

import React, { useEffect, useState } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ConfirmationStep: React.FC = () => {
  const { formData, submitWizard, isLoading } = useWizard();
  const [quoteRequestId, setQuoteRequestId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Auto-submit when component mounts
    if (!isSubmitted) {
      handleSubmit();
    }
  }, []);

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    try {
      setIsSubmitted(true);
      await submitWizard();
      // In a real app, you'd get the quote request ID from the response
      setQuoteRequestId(`quote_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`);
    } catch (error) {
      console.error('Error submitting wizard:', error);
      setIsSubmitted(false);
    }
  };

  const getSystemSummary = () => {
    const { units, systemType, heatingType } = formData;
    
    if (units === 'more-than-3' || units === 'dont-know' || 
        systemType === 'dont-know' || heatingType === 'dont-know') {
      return 'Custom consultation required';
    }
    
    const unitText = units === 'one' ? '1 AC Unit' : units === 'two' ? '2 AC Units' : '';
    const systemText = systemType === 'split' ? 'Split System' : systemType === 'package' ? 'Package System' : '';
    const heatingText = heatingType === 'heat-pump' ? 'Heat Pump' : heatingType === 'gas' ? 'Gas Heating' : '';
    
    return `${unitText} - ${systemText} with ${heatingText}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Submitting your quote request...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Quote Request Submitted!</CardTitle>
          <CardDescription>
            Thank you for choosing Mint Home for your HVAC needs. We've received your information and will contact you soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Request Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Property Address</p>
                <p>{formData.address.street}</p>
                <p>{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground">System Requirements</p>
                <p>{getSystemSummary()}</p>
              </div>
              
              <div>
                <p className="font-medium text-muted-foreground">Contact Information</p>
                <p>{formData.contactInfo.name}</p>
                <p>{formData.contactInfo.phone}</p>
                <p>{formData.contactInfo.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium">Review & Analysis</p>
                <p className="text-sm text-muted-foreground">Our team will review your information and analyze your HVAC needs.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium">Personal Consultation</p>
                <p className="text-sm text-muted-foreground">An HVAC expert will contact you within 24 hours to discuss your specific needs.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <p className="font-medium">Custom Quote</p>
                <p className="text-sm text-muted-foreground">Receive your personalized quote with transparent pricing and installation timeline.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          size="lg"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};