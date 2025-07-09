import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

    const oneUnitOption = screen.getByLabelText('1 AC Unit')
    await user.click(oneUnitOption)

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('units', 'one')
  })

  it('displays selected option correctly', () => {
    mockWizard.formData.units = 'two'
    render(<ACUnitsStep />)

    const twoUnitOption = screen.getByLabelText('2 AC Units')
    expect(twoUnitOption).toBeChecked()
  })

  it('shows warning message for more than 3 units', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const moreThanThreeOption = screen.getByLabelText('More than 3 AC Units')
    await user.click(moreThanThreeOption)

    await waitFor(() => {
      expect(screen.getByText(/for homes with more than 3 ac units/i)).toBeInTheDocument()
      expect(screen.getByText(/we&apos;ll need to discuss your specific needs/i)).toBeInTheDocument()
    })
  })

  it('shows info message for dont know option', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const dontKnowOption = screen.getByLabelText("I don't know")
    await user.click(dontKnowOption)

    await waitFor(() => {
      expect(screen.getByText(/no problem! our experts can help/i)).toBeInTheDocument()
      expect(screen.getByText(/we&apos;ll contact you to discuss/i)).toBeInTheDocument()
    })
  })

  it('does not show info messages for standard options', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const oneUnitOption = screen.getByLabelText('1 AC Unit')
    await user.click(oneUnitOption)

    await waitFor(() => {
      expect(screen.queryByText(/for homes with more than 3 ac units/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/no problem! our experts can help/i)).not.toBeInTheDocument()
    })
  })

  it('displays appropriate icons for each option', () => {
    render(<ACUnitsStep />)

    // Check that SVG icons are present (testing for SVG elements)
    const svgIcons = screen.getAllByRole('img', { hidden: true })
    expect(svgIcons).toHaveLength(4) // One for each option
  })

  it('syncs with wizard context when form data changes', () => {
    const { rerender } = render(<ACUnitsStep />)

    // Update mock data
    mockWizard.formData.units = 'two'
    rerender(<ACUnitsStep />)

    const twoUnitOption = screen.getByLabelText('2 AC Units')
    expect(twoUnitOption).toBeChecked()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    // Tab to first option
    await user.tab()
    const firstOption = screen.getByLabelText('1 AC Unit')
    expect(firstOption).toHaveFocus()

    // Press space to select
    await user.keyboard(' ')
    expect(mockWizard.updateFormData).toHaveBeenCalledWith('units', 'one')
  })

  it('displays hover effects on options', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const optionContainer = screen.getByLabelText('1 AC Unit').closest('div')
    expect(optionContainer).toHaveClass('hover:bg-accent/50')
  })

  it('updates form data immediately when option is selected', async () => {
    const user = userEvent.setup()
    render(<ACUnitsStep />)

    const twoUnitOption = screen.getByLabelText('2 AC Units')
    await user.click(twoUnitOption)

    expect(mockWizard.updateFormData).toHaveBeenCalledWith('units', 'two')
  })

  it('maintains selection state across re-renders', () => {
    mockWizard.formData.units = 'more-than-3'
    const { rerender } = render(<ACUnitsStep />)

    let moreThanThreeOption = screen.getByLabelText('More than 3 AC Units')
    expect(moreThanThreeOption).toBeChecked()

    rerender(<ACUnitsStep />)

    moreThanThreeOption = screen.getByLabelText('More than 3 AC Units')
    expect(moreThanThreeOption).toBeChecked()
  })

  it('displays contextual help text', () => {
    render(<ACUnitsStep />)

    expect(screen.getByText(/how many ac units do you currently have/i)).toBeInTheDocument()
    expect(screen.getByText(/this helps us understand your system size/i)).toBeInTheDocument()
  })
})