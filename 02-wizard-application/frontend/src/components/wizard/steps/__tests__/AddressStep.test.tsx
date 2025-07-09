import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddressStep } from '../AddressStep'

// Mock the wizard context
const mockWizard = {
  formData: {
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
  },
  updateFormData: jest.fn(),
  currentStep: 'address',
  sessionId: 'test-session',
  completedSteps: [],
  isLoading: false,
  goToStep: jest.fn(),
  goNext: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => false),
  canGoNext: jest.fn(() => false),
  getStepIndex: jest.fn(() => 0),
  submitWizard: jest.fn(),
}

jest.mock('@/contexts/WizardContext', () => ({
  useWizard: () => mockWizard,
  WizardProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('AddressStep', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock form data
    mockWizard.formData.address = {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })

  it('renders address form fields', () => {
    render(<AddressStep />)

    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
  })

  it('displays the correct title and description', () => {
    render(<AddressStep />)

    expect(screen.getByText('Property Address')).toBeInTheDocument()
    expect(screen.getByText(/please provide your address/i)).toBeInTheDocument()
  })

  it('displays form fields with existing data', () => {
    mockWizard.formData.address = {
      street: '123 Main St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    }

    render(<AddressStep />)

    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Austin')).toBeInTheDocument()
    expect(screen.getByText('Texas')).toBeInTheDocument()
    expect(screen.getByDisplayValue('78701')).toBeInTheDocument()
  })

  it('updates form data when user types in street field', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const streetInput = screen.getByLabelText(/street address/i)
    await user.type(streetInput, '123 Main St')

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('address', {
      street: '123 Main St',
      city: '',
      state: '',
      zipCode: ''
    })
  })

  it('updates form data when user types in city field', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const cityInput = screen.getByLabelText(/city/i)
    await user.type(cityInput, 'Austin')

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('address', {
      street: '',
      city: 'Austin',
      state: '',
      zipCode: ''
    })
  })

  it('updates form data when user selects state', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const stateSelect = screen.getByRole('combobox')
    await user.click(stateSelect)
    
    const texasOption = screen.getByText('Texas')
    await user.click(texasOption)

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('address', {
      street: '',
      city: '',
      state: 'TX',
      zipCode: ''
    })
  })

  it('updates form data when user types in zip code field', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const zipInput = screen.getByLabelText(/zip code/i)
    await user.type(zipInput, '78701')

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('address', {
      street: '',
      city: '',
      state: '',
      zipCode: '78701'
    })
  })

  it('validates required fields and shows error messages', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const streetInput = screen.getByLabelText(/street address/i)
    
    // Focus and blur to trigger validation
    await user.click(streetInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('Street address is required')).toBeInTheDocument()
    })
  })

  it('validates zip code format', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const zipInput = screen.getByLabelText(/zip code/i)
    await user.type(zipInput, '123')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid ZIP code')).toBeInTheDocument()
    })
  })

  it('accepts valid zip code formats', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const zipInput = screen.getByLabelText(/zip code/i)
    
    // Test 5-digit zip
    await user.type(zipInput, '78701')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid ZIP code')).not.toBeInTheDocument()
    })

    // Clear and test 9-digit zip
    await user.clear(zipInput)
    await user.type(zipInput, '78701-1234')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid ZIP code')).not.toBeInTheDocument()
    })
  })

  it('displays info message about service areas', () => {
    render(<AddressStep />)

    expect(screen.getByText(/we currently service texas, nevada, and arizona/i)).toBeInTheDocument()
  })

  it('shows state options in select dropdown', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const stateSelect = screen.getByRole('combobox')
    await user.click(stateSelect)

    expect(screen.getByText('Texas')).toBeInTheDocument()
    expect(screen.getByText('Nevada')).toBeInTheDocument()
    expect(screen.getByText('Arizona')).toBeInTheDocument()
  })

  it('applies error styling to fields with errors', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const streetInput = screen.getByLabelText(/street address/i)
    await user.click(streetInput)
    await user.tab()

    await waitFor(() => {
      expect(streetInput).toHaveClass('border-destructive')
    })
  })

  it('removes error styling when field is corrected', async () => {
    const user = userEvent.setup()
    render(<AddressStep />)

    const streetInput = screen.getByLabelText(/street address/i)
    
    // Trigger error
    await user.click(streetInput)
    await user.tab()

    await waitFor(() => {
      expect(streetInput).toHaveClass('border-destructive')
    })

    // Fix the error
    await user.type(streetInput, '123 Main St')
    await user.tab()

    await waitFor(() => {
      expect(streetInput).not.toHaveClass('border-destructive')
    })
  })

  it('syncs with wizard context form data changes', () => {
    const { rerender } = render(<AddressStep />)

    // Update mock data
    mockWizard.formData.address = {
      street: '456 Oak St',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201'
    }

    rerender(<AddressStep />)

    expect(screen.getByDisplayValue('456 Oak St')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Dallas')).toBeInTheDocument()
    expect(screen.getByDisplayValue('75201')).toBeInTheDocument()
  })
})