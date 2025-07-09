import { Test, TestingModule } from '@nestjs/testing';
import { WizardController } from './wizard.controller';
import { WizardService } from './wizard.service';
import { NextStepRequestDto, SubmitWizardRequestDto } from './dto/wizard.dto';

describe('WizardController', () => {
  let controller: WizardController;
  let service: WizardService;

  const mockWizardService = {
    determineNextStep: jest.fn(),
    submitWizard: jest.fn(),
    getSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WizardController],
      providers: [
        {
          provide: WizardService,
          useValue: mockWizardService,
        },
      ],
    }).compile();

    controller = module.get<WizardController>(WizardController);
    service = module.get<WizardService>(WizardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('determineNextStep', () => {
    it('should call wizardService.determineNextStep and return result', async () => {
      const requestDto: NextStepRequestDto = {
        sessionId: 'test-session',
        currentStep: 'address',
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: '',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        }
      };

      const expectedResponse = {
        nextStep: 'ac-units' as const,
        sessionId: 'test-session'
      };

      mockWizardService.determineNextStep.mockResolvedValue(expectedResponse);

      const result = await controller.determineNextStep(requestDto);

      expect(service.determineNextStep).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle errors from service', async () => {
      const requestDto: NextStepRequestDto = {
        sessionId: 'test-session',
        currentStep: 'address',
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: '',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        }
      };

      mockWizardService.determineNextStep.mockRejectedValue(new Error('Service error'));

      await expect(controller.determineNextStep(requestDto)).rejects.toThrow('Service error');
    });
  });

  describe('submitWizard', () => {
    it('should call wizardService.submitWizard and return result', async () => {
      const requestDto: SubmitWizardRequestDto = {
        sessionId: 'test-session',
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: 'one',
          systemType: 'split',
          heatingType: 'heat-pump',
          contactInfo: { name: 'John Doe', phone: '555-1234', email: 'john@example.com' }
        }
      };

      const expectedResponse = {
        success: true,
        quoteRequestId: 'quote_123'
      };

      mockWizardService.submitWizard.mockResolvedValue(expectedResponse);

      const result = await controller.submitWizard(requestDto);

      expect(service.submitWizard).toHaveBeenCalledWith(requestDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getSession', () => {
    it('should return session data when session exists', async () => {
      const sessionId = 'test-session';
      const sessionData = {
        currentStep: 'address' as const,
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: '',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        }
      };

      mockWizardService.getSession.mockResolvedValue(sessionData);

      const result = await controller.getSession(sessionId);

      expect(service.getSession).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(sessionData);
    });

    it('should return error when session not found', async () => {
      const sessionId = 'non-existent-session';

      mockWizardService.getSession.mockResolvedValue(undefined);

      const result = await controller.getSession(sessionId);

      expect(service.getSession).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual({ error: 'Session not found' });
    });
  });
});
