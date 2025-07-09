import { render, screen, act, waitFor } from '@testing-library/react'
import { WizardProvider, useWizard } from '../WizardContext'
import { WizardStep } from '@/types/wizard'

// Mock the API calls
global.fetch = jest.fn()

// Test component to use the wizard context
const TestComponent = () => {
  const wizard = useWizard()

  return (
    <div>
      <div data-testid="current-step">{wizard.currentStep}</div>
      <div data-testid="session-id">{wizard.sessionId}</div>
      <div data-testid="loading">{wizard.isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="can-go-back">{wizard.canGoBack() ? 'can-go-back' : 'cannot-go-back'}</div>
      <div data-testid="can-go-next">{wizard.canGoNext() ? 'can-go-next' : 'cannot-go-next'}</div>
      <button data-testid="go-next" onClick={wizard.goNext}>Next</button>
      <button data-testid="go-back" onClick={wizard.goBack}>Back</button>
      <button 
        data-testid="update-address" 
        onClick={() => wizard.updateFormData('address', {
          street: '123 Main St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701'
        })}
      >
        Update Address
      </button>
    </div>
  )
}

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <WizardProvider>
      {component}
    </WizardProvider>
  )
}

describe('WizardContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    // Mock successful API responses
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ nextStep: 'ac-units' })
    })
  })

  it('should provide initial wizard state', () => {
    renderWithProvider(<TestComponent />)

    expect(screen.getByTestId('current-step')).toHaveTextContent('address')
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    expect(screen.getByTestId('cannot-go-back')).toBeInTheDocument()
    expect(screen.getByTestId('cannot-go-next')).toBeInTheDocument() // Initially cannot go next with empty form
  })

  it('should generate and store session ID', async () => {
    renderWithProvider(<TestComponent />)

    await waitFor(() => {
      const sessionId = screen.getByTestId('session-id').textContent
      expect(sessionId).toMatch(/^wizard_\d+_[a-z0-9]+$/)
      expect(localStorage.setItem).toHaveBeenCalledWith('wizardSessionId', sessionId)
    })
  })

  it('should update form data', async () => {
    renderWithProvider(<TestComponent />)

    act(() => {
      screen.getByTestId('update-address').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('can-go-next')).toBeInTheDocument()
    })
  })

  it('should handle going to next step', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ nextStep: 'ac-units' })
    })

    renderWithProvider(<TestComponent />)

    // First update form data to enable next button
    act(() => {
      screen.getByTestId('update-address').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('can-go-next')).toBeInTheDocument()
    })

    act(() => {
      screen.getByTestId('go-next').click()
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/wizard/next-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('address')
      })
    })
  })

  it('should handle going back', async () => {
    renderWithProvider(<TestComponent />)

    // Simulate being on a later step
    act(() => {
      screen.getByTestId('update-address').click()
    })

    // Mock the next step response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ nextStep: 'ac-units' })
    })

    await act(async () => {
      screen.getByTestId('go-next').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('can-go-back')).toBeInTheDocument()
    })
  })

  it('should validate address step correctly', () => {
    renderWithProvider(<TestComponent />)

    // Initially should not be able to go next
    expect(screen.getByTestId('cannot-go-next')).toBeInTheDocument()

    // After updating address, should be able to go next
    act(() => {
      screen.getByTestId('update-address').click()
    })

    expect(screen.getByTestId('can-go-next')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    renderWithProvider(<TestComponent />)

    act(() => {
      screen.getByTestId('update-address').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('can-go-next')).toBeInTheDocument()
    })

    act(() => {
      screen.getByTestId('go-next').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('not-loading')).toBeInTheDocument()
    })
  })

  it('should persist state to localStorage', async () => {
    renderWithProvider(<TestComponent />)

    await waitFor(() => {
      const sessionId = screen.getByTestId('session-id').textContent
      expect(localStorage.setItem).toHaveBeenCalledWith(
        `wizardState_${sessionId}`,
        expect.stringContaining('address')
      )
    })
  })

  it('should restore state from localStorage', () => {
    const mockSessionId = 'wizard_123_abc'
    const mockState = {
      sessionId: mockSessionId,
      currentStep: 'ac-units',
      formData: {
        address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
        units: 'one',
        systemType: '',
        heatingType: '',
        contactInfo: { name: '', phone: '', email: '' }
      },
      completedSteps: ['address'],
      isLoading: false
    }

    localStorage.setItem('wizardSessionId', mockSessionId)
    localStorage.setItem(`wizardState_${mockSessionId}`, JSON.stringify(mockState))

    renderWithProvider(<TestComponent />)

    expect(screen.getByTestId('current-step')).toHaveTextContent('ac-units')
    expect(screen.getByTestId('session-id')).toHaveTextContent(mockSessionId)
  })

  it('should handle malformed localStorage data', () => {
    const mockSessionId = 'wizard_123_abc'
    localStorage.setItem('wizardSessionId', mockSessionId)
    localStorage.setItem(`wizardState_${mockSessionId}`, 'invalid json')

    // Should not throw error and should use default state
    renderWithProvider(<TestComponent />)

    expect(screen.getByTestId('current-step')).toHaveTextContent('address')
  })
})

describe('WizardContext validation', () => {
  it('should validate different step types correctly', () => {
    const TestValidationComponent = () => {
      const wizard = useWizard()

      const testAddressValidation = () => {
        wizard.updateFormData('address', {
          street: '123 Main St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701'
        })
      }

      const testUnitsValidation = () => {
        wizard.updateFormData('units', 'one')
      }

      return (
        <div>
          <div data-testid="current-step">{wizard.currentStep}</div>
          <div data-testid="can-go-next">{wizard.canGoNext() ? 'can-go-next' : 'cannot-go-next'}</div>
          <button data-testid="set-address" onClick={testAddressValidation}>Set Address</button>
          <button data-testid="set-units" onClick={testUnitsValidation}>Set Units</button>
          <button data-testid="go-to-units" onClick={() => wizard.goToStep('ac-units')}>Go to Units</button>
        </div>
      )
    }

    renderWithProvider(<TestValidationComponent />)

    // Test address validation
    expect(screen.getByTestId('cannot-go-next')).toBeInTheDocument()
    
    act(() => {
      screen.getByTestId('set-address').click()
    })

    expect(screen.getByTestId('can-go-next')).toBeInTheDocument()

    // Test units step validation
    act(() => {
      screen.getByTestId('go-to-units').click()
    })

    expect(screen.getByTestId('current-step')).toHaveTextContent('ac-units')
    expect(screen.getByTestId('cannot-go-next')).toBeInTheDocument()

    act(() => {
      screen.getByTestId('set-units').click()
    })

    expect(screen.getByTestId('can-go-next')).toBeInTheDocument()
  })
})