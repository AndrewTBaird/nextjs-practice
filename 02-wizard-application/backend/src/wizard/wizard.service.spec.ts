import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WizardService } from './wizard.service';
import { WizardSession } from './entities/wizard-session.entity';
import { QuoteRequestService } from '../quote-request/quote-request.service';
import { NextStepRequestDto, SubmitWizardRequestDto } from './dto/wizard.dto';

describe('WizardService', () => {
  let service: WizardService;
  let wizardSessionRepository: Repository<WizardSession>;
  let quoteRequestService: QuoteRequestService;

  const mockWizardSessionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockQuoteRequestService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WizardService,
        {
          provide: getRepositoryToken(WizardSession),
          useValue: mockWizardSessionRepository,
        },
        {
          provide: QuoteRequestService,
          useValue: mockQuoteRequestService,
        },
      ],
    }).compile();

    service = module.get<WizardService>(WizardService);
    wizardSessionRepository = module.get<Repository<WizardSession>>(getRepositoryToken(WizardSession));
    quoteRequestService = module.get<QuoteRequestService>(QuoteRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('determineNextStep', () => {
    it('should save session and return next step for address -> ac-units', async () => {
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

      mockWizardSessionRepository.findOne.mockResolvedValue(null);
      mockWizardSessionRepository.create.mockReturnValue({
        sessionId: 'test-session',
        currentStep: 'address',
        formData: JSON.stringify(requestDto.formData)
      });

      const result = await service.determineNextStep(requestDto);

      expect(result).toEqual({
        nextStep: 'ac-units',
        sessionId: 'test-session'
      });
      expect(mockWizardSessionRepository.findOne).toHaveBeenCalledWith({
        where: { sessionId: 'test-session' }
      });
      expect(mockWizardSessionRepository.create).toHaveBeenCalledWith({
        sessionId: 'test-session',
        currentStep: 'address',
        formData: JSON.stringify(requestDto.formData)
      });
      expect(mockWizardSessionRepository.save).toHaveBeenCalled();
    });

    it('should route to contact-only when units is more-than-3', async () => {
      const requestDto: NextStepRequestDto = {
        sessionId: 'test-session',
        currentStep: 'ac-units',
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: 'more-than-3',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        }
      };

      mockWizardSessionRepository.findOne.mockResolvedValue(null);
      mockWizardSessionRepository.create.mockReturnValue({});

      const result = await service.determineNextStep(requestDto);

      expect(result.nextStep).toBe('contact-only');
    });

    it('should route to contact-only when units is dont-know', async () => {
      const requestDto: NextStepRequestDto = {
        sessionId: 'test-session',
        currentStep: 'ac-units',
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: 'dont-know',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        }
      };

      mockWizardSessionRepository.findOne.mockResolvedValue(null);
      mockWizardSessionRepository.create.mockReturnValue({});

      const result = await service.determineNextStep(requestDto);

      expect(result.nextStep).toBe('contact-only');
    });

    it('should update existing session when session exists', async () => {
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

      const existingSession = {
        sessionId: 'test-session',
        currentStep: 'address',
        formData: '{}',
      };

      mockWizardSessionRepository.findOne.mockResolvedValue(existingSession);

      await service.determineNextStep(requestDto);

      expect(existingSession.currentStep).toBe('address');
      expect(existingSession.formData).toBe(JSON.stringify(requestDto.formData));
      expect(mockWizardSessionRepository.save).toHaveBeenCalledWith(existingSession);
    });
  });

  describe('submitWizard', () => {
    it('should create quote request and clear session', async () => {
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

      const mockQuoteResponse = {
        success: true,
        quoteRequestId: 'quote_123_abc',
        message: 'Quote request submitted successfully. Our team will contact you soon.'
      };

      mockQuoteRequestService.create.mockResolvedValue(mockQuoteResponse);

      const result = await service.submitWizard(requestDto);

      expect(result.success).toBe(true);
      expect(result.quoteRequestId).toBe('quote_123_abc');
      expect(mockQuoteRequestService.create).toHaveBeenCalledWith({
        sessionId: 'test-session',
        formData: requestDto.formData
      });
      expect(mockWizardSessionRepository.delete).toHaveBeenCalledWith({ sessionId: 'test-session' });
    });
  });

  describe('getSession', () => {
    it('should return session data when session exists', async () => {
      const sessionId = 'test-session';
      const mockSession = {
        sessionId: 'test-session',
        currentStep: 'address',
        formData: JSON.stringify({
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: '',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        })
      };

      mockWizardSessionRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.getSession(sessionId);

      expect(result).toEqual({
        currentStep: 'address',
        formData: {
          address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
          units: '',
          systemType: '',
          heatingType: '',
          contactInfo: { name: '', phone: '', email: '' }
        }
      });
      expect(mockWizardSessionRepository.findOne).toHaveBeenCalledWith({
        where: { sessionId: 'test-session' }
      });
    });

    it('should return undefined when session does not exist', async () => {
      const sessionId = 'non-existent-session';

      mockWizardSessionRepository.findOne.mockResolvedValue(null);

      const result = await service.getSession(sessionId);

      expect(result).toBeUndefined();
      expect(mockWizardSessionRepository.findOne).toHaveBeenCalledWith({
        where: { sessionId: 'non-existent-session' }
      });
    });
  });
});
