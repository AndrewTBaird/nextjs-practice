import { render, screen, act, waitFor } from '@testing-library/react'
import { WizardProvider, useWizard } from '../WizardContext'

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
    expect(screen.getByTestId('can-go-back')).toHaveTextContent('cannot-go-back')
    expect(screen.getByTestId('can-go-next')).toHaveTextContent('cannot-go-next') // Initially cannot go next with empty form
  })

  it('should generate session ID', async () => {
    renderWithProvider(<TestComponent />)

    await waitFor(() => {
      const sessionId = screen.getByTestId('session-id').textContent
      expect(sessionId).toMatch(/^wizard_\d+_[a-z0-9]+$/)
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
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })
  })

})

