import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WizardService } from './wizard.service';
import { WizardSession } from './entities/wizard-session.entity';
import { QuoteRequest } from './entities/quote-request.entity';
import { NextStepRequestDto, SubmitWizardRequestDto } from './dto/wizard.dto';

describe('WizardService', () => {
  let service: WizardService;
  let wizardSessionRepository: Repository<WizardSession>;
  let quoteRequestRepository: Repository<QuoteRequest>;

  const mockWizardSessionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockQuoteRequestRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
          provide: getRepositoryToken(QuoteRequest),
          useValue: mockQuoteRequestRepository,
        },
      ],
    }).compile();

    service = module.get<WizardService>(WizardService);
    wizardSessionRepository = module.get<Repository<WizardSession>>(getRepositoryToken(WizardSession));
    quoteRequestRepository = module.get<Repository<QuoteRequest>>(getRepositoryToken(QuoteRequest));
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

      const mockQuoteRequest = {
        quoteRequestId: 'quote_123',
        sessionId: 'test-session',
        street: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        units: 'one',
        systemType: 'split',
        heatingType: 'heat-pump',
        name: 'John Doe',
        phone: '555-1234',
        email: 'john@example.com',
      };

      mockQuoteRequestRepository.create.mockReturnValue(mockQuoteRequest);

      const result = await service.submitWizard(requestDto);

      expect(result.success).toBe(true);
      expect(result.quoteRequestId).toMatch(/^quote_\d+_[a-z0-9]+$/);
      expect(mockQuoteRequestRepository.create).toHaveBeenCalledWith({
        quoteRequestId: expect.stringMatching(/^quote_\d+_[a-z0-9]+$/),
        sessionId: 'test-session',
        street: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        units: 'one',
        systemType: 'split',
        heatingType: 'heat-pump',
        name: 'John Doe',
        phone: '555-1234',
        email: 'john@example.com',
      });
      expect(mockQuoteRequestRepository.save).toHaveBeenCalledWith(mockQuoteRequest);
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
