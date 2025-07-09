import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ACUnitsStep } from '../ACUnitsStep'

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
  currentStep: 'ac-units',
  sessionId: 'test-session',
  completedSteps: [],
  isLoading: false,
  goToStep: jest.fn(),
  goNext: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  canGoNext: jest.fn(() => false),
  getStepIndex: jest.fn(() => 1),
  submitWizard: jest.fn(),
}

jest.mock('@/contexts/WizardContext', () => ({
  useWizard: () => mockWizard,
}))

describe('ACUnitsStep', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockWizard.formData.units = ''
  })

  it('renders AC units selection options', () => {
    render(<ACUnitsStep />)

    expect(screen.getByText('AC Units')).toBeInTheDocument()
    expect(screen.getByText('1 AC Unit')).toBeInTheDocument()
    expect(screen.getByText('2 AC Units')).toBeInTheDocument()
    expect(screen.getByText('More than 3 AC Units')).toBeInTheDocument()
    expect(screen.getByText("I don't know")).toBeInTheDocument()
  })

  it('displays correct descriptions for each option', () => {
    render(<ACUnitsStep />)

    expect(screen.getByText('Single unit for your home')).toBeInTheDocument()
    expect(screen.getByText('Two separate units or zones')).toBeInTheDocument()
    expect(screen.getByText('Multiple units or complex system')).toBeInTheDocument()
    expect(screen.getByText('Not sure about my current setup')).toBeInTheDocument()
  })

  it('allows user to select AC unit option', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const oneUnitOption = screen.getByRole('radio', { name: /1 AC Unit/ })
    await user.click(oneUnitOption)

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('units', 'one')
  })

  it('displays selected option correctly', () => {
    mockWizard.formData.units = 'two'
    render(<ACUnitsStep />)

    const twoUnitOption = screen.getByRole('radio', { name: /2 AC Units/ })
    expect(twoUnitOption).toBeChecked()
  })




  it('displays appropriate icons for each option', () => {
    render(<ACUnitsStep />)

    // Check that SVG elements are present
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('syncs with wizard context when form data changes', () => {
    const { rerender } = render(<ACUnitsStep />)

    // Update mock data
    mockWizard.formData.units = 'two'
    rerender(<ACUnitsStep />)

    const twoUnitOption = screen.getByRole('radio', { name: /2 AC Units/ })
    expect(twoUnitOption).toBeChecked()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    // Tab to first option
    await user.tab()
    const firstOption = screen.getByRole('radio', { name: /1 AC Unit/ })
    expect(firstOption).toHaveFocus()

    // Press space to select
    await user.keyboard(' ')
    expect(mockWizard.updateFormData).toHaveBeenCalledWith('units', 'one')
  })

  it('displays hover effects on options', () => {
    render(<ACUnitsStep />)

    const optionContainer = screen.getByRole('radio', { name: /1 AC Unit/ }).closest('div')
    expect(optionContainer).toHaveClass('hover:bg-accent/50')
  })

  it('updates form data immediately when option is selected', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const twoUnitOption = screen.getByRole('radio', { name: /2 AC Units/ })
    await user.click(twoUnitOption)

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('units', 'two')
  })

  it('maintains selection state across re-renders', () => {
    mockWizard.formData.units = 'more-than-3'
    const { rerender } = render(<ACUnitsStep />)

    let moreThanThreeOption = screen.getByRole('radio', { name: /More than 3 AC Units/ })
    expect(moreThanThreeOption).toBeChecked()

    rerender(<ACUnitsStep />)

    moreThanThreeOption = screen.getByRole('radio', { name: /More than 3 AC Units/ })
    expect(moreThanThreeOption).toBeChecked()
  })

  it('displays contextual help text', () => {
    render(<ACUnitsStep />)

    expect(screen.getByText(/how many ac units do you currently have/i)).toBeInTheDocument()
    expect(screen.getByText(/this helps us understand your system size/i)).toBeInTheDocument()
  })
})