'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardContextType, WizardState, WizardStep, WizardData } from '@/types/wizard';

const initialFormData: WizardData = {
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: ''
  },
  units: '',
  systemType: '',
  heatingType: '',
  contactInfo: {
    name: '',
    phone: '',
    email: ''
  }
};

const initialState: WizardState = {
  sessionId: '',
  currentStep: 'address',
  formData: initialFormData,
  completedSteps: [],
  isLoading: false
};

type WizardAction = 
  | { type: 'SET_CURRENT_STEP'; payload: WizardStep }
  | { type: 'UPDATE_FORM_DATA'; payload: { step: keyof WizardData; data: any } }
  | { type: 'SET_COMPLETED_STEPS'; payload: WizardStep[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'RESTORE_STATE'; payload: Partial<WizardState> };

const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.step]: action.payload.data
        }
      };
    case 'SET_COMPLETED_STEPS':
      return { ...state, completedSteps: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'RESTORE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const WizardContext = createContext<WizardContextType>({} as WizardContextType);

// Step configuration - updated to match your routing structure
const STEP_ORDER: WizardStep[] = [
  'address',
  'ac-units',     // Changed from 'units' to match routing
  'system-type',
  'heating-type',
  'contact-info',
  'contact-only', // Added contact-only step
  'confirmation'
];

const getNextStep = (currentStep: WizardStep, formData: WizardData): WizardStep => {
  switch (currentStep) {
    case 'address':
      return 'ac-units';
    case 'ac-units':
      if (formData.units === 'more-than-3' || formData.units === 'dont-know') {
        return 'contact-only';
      }
      return 'system-type';
    case 'system-type':
      if (formData.systemType === 'dont-know') {
        return 'contact-only';
      }
      return 'heating-type';
    case 'heating-type':
      if (formData.heatingType === 'dont-know') {
        return 'contact-only';
      }
      return 'contact-info';
    case 'contact-info':
      return 'confirmation';
    case 'contact-only':
      return 'confirmation';
    default:
      return 'address';
  }
};

const getPreviousStep = (currentStep: WizardStep, formData: WizardData): WizardStep => {
  switch (currentStep) {
    case 'ac-units':
      return 'address';
    case 'system-type':
      return 'ac-units';
    case 'heating-type':
      return 'system-type';
    case 'contact-only':
      // Dynamic previous step based on where they came from
      if (formData.units === 'more-than-3' || formData.units === 'dont-know') {
        return 'ac-units';
      }
      if (formData.systemType === 'dont-know') {
        return 'system-type';
      }
      if (formData.heatingType === 'dont-know') {
        return 'heating-type';
      }
      return 'ac-units';
    case 'confirmation':
      // Check the last step they were on
      if (formData.units === 'more-than-3' || formData.units === 'dont-know' || 
          formData.systemType === 'dont-know' || formData.heatingType === 'dont-know') {
        return 'contact-only';
      }
      return 'contact-info';
    default:
      return 'address';
  }
};

// Helper function to check if we're on the client side
const isClient = typeof window !== 'undefined';

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const router = useRouter();

  // Initialize session on mount (client-side only)
  useEffect(() => {
    if (!isClient) return;

    const sessionId = localStorage.getItem('wizardSessionId') || generateSessionId();
    localStorage.setItem('wizardSessionId', sessionId);
    dispatch({ type: 'SET_SESSION_ID', payload: sessionId });

    // Try to restore state from localStorage
    const savedState = localStorage.getItem(`wizardState_${sessionId}`);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'RESTORE_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to restore wizard state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (!isClient || !state.sessionId) return;

    localStorage.setItem(`wizardState_${state.sessionId}`, JSON.stringify(state));
  }, [state]);

  const generateSessionId = (): string => {
    return 'wizard_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
  };

  const updateFormData = (step: keyof WizardData, data: any) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { step, data } });
  };

  const goToStep = (step: WizardStep) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
    router.push(`/wizard/${step}`);
  };

  const goNext = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Call backend API to determine next step
      const response = await fetch('http://localhost:3000/api/wizard/next-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          currentStep: state.currentStep,
          formData: state.formData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get next step');
      }
      
      const result = await response.json();
      const nextStep = result.nextStep;
      
      // Add current step to completed steps
      if (!state.completedSteps.includes(state.currentStep)) {
        dispatch({ 
          type: 'SET_COMPLETED_STEPS', 
          payload: [...state.completedSteps, state.currentStep] 
        });
      }
      
      goToStep(nextStep);
    } catch (error) {
      console.error('Error getting next step:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const goBack = () => {
    const previousStep = getPreviousStep(state.currentStep, state.formData);
    goToStep(previousStep);
  };

  const canGoBack = (): boolean => {
    return state.currentStep !== 'address';
  };

  const canGoNext = (): boolean => {
    // Add validation logic here for each step
    switch (state.currentStep) {
      case 'address':
        const { street, city, state: addressState, zipCode } = state.formData.address;
        return street.trim() !== '' && city.trim() !== '' && addressState.trim() !== '' && zipCode.trim() !== '';
      case 'ac-units':
        return state.formData.units !== '';
      case 'system-type':
        return state.formData.systemType !== '';
      case 'heating-type':
        return state.formData.heatingType !== '';
      case 'contact-info':
      case 'contact-only':
        const { name, phone, email } = state.formData.contactInfo;
        return name.trim() !== '' && phone.trim() !== '' && email.trim() !== '';
      default:
        return true;
    }
  };

  const getStepIndex = (step: WizardStep): number => {
    return STEP_ORDER.indexOf(step);
  };

  const saveProgress = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('http://localhost:3000/api/wizard/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          currentStep: state.currentStep,
          formData: state.formData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const submitWizard = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('http://localhost:3000/api/wizard/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: state.sessionId,
          formData: state.formData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit wizard');
      }
      
      // Clear local storage after successful submission
      if (isClient) {
        localStorage.removeItem(`wizardState_${state.sessionId}`);
        localStorage.removeItem('wizardSessionId');
      }
    } catch (error) {
      console.error('Error submitting wizard:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: WizardContextType = {
    sessionId: state.sessionId,
    currentStep: state.currentStep,
    formData: state.formData,
    completedSteps: state.completedSteps,
    isLoading: state.isLoading,
    updateFormData,
    goToStep,
    goNext,
    goBack,
    canGoBack,
    canGoNext,
    getStepIndex,
    saveProgress,
    submitWizard,
  };

  return <WizardContext.Provider value={contextValue}>{children}</WizardContext.Provider>;
};

export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  return context;
};