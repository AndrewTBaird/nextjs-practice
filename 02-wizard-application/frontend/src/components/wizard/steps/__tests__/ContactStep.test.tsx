import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactStep } from '../ContactStep'

// Mock the wizard context
const mockWizard = {
  formData: {
    address: { street: '', city: '', state: '', zipCode: '' },
    units: '',
    systemType: '',
    heatingType: '',
    contactInfo: { name: '', phone: '', email: '' }
  },
  updateFormData: jest.fn(),
  currentStep: 'contact-info',
  sessionId: 'test-session',
  completedSteps: [],
  isLoading: false,
  goToStep: jest.fn(),
  goNext: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  canGoNext: jest.fn(() => false),
  getStepIndex: jest.fn(() => 4),
  submitWizard: jest.fn(),
}

jest.mock('@/contexts/WizardContext', () => ({
  useWizard: () => mockWizard,
}))

describe('ContactStep', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockWizard.formData.contactInfo = { name: '', phone: '', email: '' }
    mockWizard.currentStep = 'contact-info'
    mockWizard.formData.units = 'one'
    mockWizard.formData.systemType = 'split'
    mockWizard.formData.heatingType = 'heat-pump'
  })

  it('renders contact form fields', () => {
    render(<ContactStep />)

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  it('displays standard title for regular flow', () => {
    render(<ContactStep />)

    expect(screen.getByText('Contact Information')).toBeInTheDocument()
    expect(screen.getByText(/how can we reach you with your personalized hvac quote/i)).toBeInTheDocument()
  })

  it('displays consultation title for consultation flow', () => {
    mockWizard.currentStep = 'contact-only'
    render(<ContactStep />)

    expect(screen.getByText("Let's Get You Connected")).toBeInTheDocument()
    expect(screen.getByText(/we&apos;ll need to discuss your specific hvac needs/i)).toBeInTheDocument()
  })

  it('displays consultation title when units is dont-know', () => {
    mockWizard.formData.units = 'dont-know'
    render(<ContactStep />)

    expect(screen.getByText("Let's Get You Connected")).toBeInTheDocument()
  })

  it('displays consultation title when units is more-than-3', () => {
    mockWizard.formData.units = 'more-than-3'
    render(<ContactStep />)

    expect(screen.getByText("Let's Get You Connected")).toBeInTheDocument()
  })

  it('updates form data when user types in name field', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'John Doe')

    // Due to debouncing, we need to wait
    await waitFor(() => {
      expect(mockWizard.updateFormData).toHaveBeenCalledWith('contactInfo', {
        name: 'John Doe',
        phone: '',
        email: ''
      })
    }, { timeout: 200 })
  })

  it('updates form data when user types in phone field', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '555-1234')

    await waitFor(() => {
      expect(mockWizard.updateFormData).toHaveBeenCalledWith('contactInfo', {
        name: '',
        phone: '555-1234',
        email: ''
      })
    }, { timeout: 200 })
  })

  it('updates form data when user types in email field', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'john@example.com')

    await waitFor(() => {
      expect(mockWizard.updateFormData).toHaveBeenCalledWith('contactInfo', {
        name: '',
        phone: '',
        email: 'john@example.com'
      })
    }, { timeout: 200 })
  })

  it('validates required fields and shows error messages', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const nameInput = screen.getByLabelText(/full name/i)
    await user.click(nameInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('validates phone number format', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '123')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('accepts valid phone number formats', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '555-123-4567')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid phone number')).not.toBeInTheDocument()
    })
  })

  it('accepts valid email format', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'john@example.com')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
    })
  })

  it('displays standard info message for regular flow', () => {
    render(<ContactStep />)

    expect(screen.getByText(/your information is secure/i)).toBeInTheDocument()
    expect(screen.getByText(/we&apos;ll contact you within 24 hours/i)).toBeInTheDocument()
  })

  it('displays consultation info message for consultation flow', () => {
    mockWizard.currentStep = 'contact-only'
    render(<ContactStep />)

    expect(screen.getByText(/our hvac experts will call you within 2 business hours/i)).toBeInTheDocument()
    expect(screen.getByText(/we&apos;re here to help find the perfect solution/i)).toBeInTheDocument()
  })

  it('displays existing contact information', () => {
    mockWizard.formData.contactInfo = {
      name: 'John Doe',
      phone: '555-1234',
      email: 'john@example.com'
    }

    render(<ContactStep />)

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('555-1234')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
  })

  it('applies error styling to fields with errors', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const nameInput = screen.getByLabelText(/full name/i)
    await user.click(nameInput)
    await user.tab()

    await waitFor(() => {
      expect(nameInput).toHaveClass('border-destructive')
    })
  })

  it('removes error styling when field is corrected', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const nameInput = screen.getByLabelText(/full name/i)
    
    // Trigger error
    await user.click(nameInput)
    await user.tab()

    await waitFor(() => {
      expect(nameInput).toHaveClass('border-destructive')
    })

    // Fix the error
    await user.type(nameInput, 'John Doe')
    await user.tab()

    await waitFor(() => {
      expect(nameInput).not.toHaveClass('border-destructive')
    })
  })

  it('debounces form data updates', async () => {
    const user = userEvent.setup()
    render(<ContactStep />)

    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'John')
    
    // Should not update immediately
    expect(mockWizard.updateFormData).not.toHaveBeenCalled()

    // Wait for debounce
    await waitFor(() => {
      expect(mockWizard.updateFormData).toHaveBeenCalledWith('contactInfo', {
        name: 'John',
        phone: '',
        email: ''
      })
    }, { timeout: 200 })
  })

  it('handles form data changes from context', () => {
    const { rerender } = render(<ContactStep />)

    // Update mock data
    mockWizard.formData.contactInfo = {
      name: 'Jane Doe',
      phone: '555-5678',
      email: 'jane@example.com'
    }

    rerender(<ContactStep />)

    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('555-5678')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
  })

  it('shows appropriate icons for different flow types', () => {
    render(<ContactStep />)

    // Check for green checkmark icon in regular flow
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)

    // Test consultation flow
    mockWizard.currentStep = 'contact-only'
    const { rerender } = render(<ContactStep />)
    rerender(<ContactStep />)

    const consultationSvg = document.querySelectorAll('svg')
    expect(consultationSvg.length).toBeGreaterThan(0)
  })
})