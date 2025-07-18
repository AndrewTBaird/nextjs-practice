import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRequestService } from './quote-request.service';
import { QuoteRequest } from './entities/quote-request.entity';
import { CreateQuoteRequestDto } from './quote-request.controller';

describe('QuoteRequestService', () => {
  let service: QuoteRequestService;
  let repository: Repository<QuoteRequest>;

  const mockQuoteRequestRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRequestService,
        {
          provide: getRepositoryToken(QuoteRequest),
          useValue: mockQuoteRequestRepository,
        },
      ],
    }).compile();

    service = module.get<QuoteRequestService>(QuoteRequestService);
    repository = module.get<Repository<QuoteRequest>>(getRepositoryToken(QuoteRequest));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a quote request and return success response', async () => {
      const createQuoteRequestDto: CreateQuoteRequestDto = {
        sessionId: 'test-session',
        formData: {
          address: {
            street: '123 Main St',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701'
          },
          units: 'one',
          systemType: 'split',
          heatingType: 'heat-pump',
          contactInfo: {
            name: 'John Doe',
            phone: '555-1234',
            email: 'john@example.com'
          }
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
      mockQuoteRequestRepository.save.mockResolvedValue(mockQuoteRequest);

      const result = await service.create(createQuoteRequestDto);

      expect(result.success).toBe(true);
      expect(result.quoteRequestId).toMatch(/^quote_\d+_[a-z0-9]+$/);
      expect(result.message).toBe('Quote request submitted successfully. Our team will contact you soon.');
      
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
    });

    it('should handle database errors', async () => {
      const createQuoteRequestDto: CreateQuoteRequestDto = {
        sessionId: 'test-session',
        formData: {
          address: {
            street: '123 Main St',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701'
          },
          units: 'one',
          systemType: 'split',
          heatingType: 'heat-pump',
          contactInfo: {
            name: 'John Doe',
            phone: '555-1234',
            email: 'john@example.com'
          }
        }
      };

      mockQuoteRequestRepository.create.mockReturnValue({});
      mockQuoteRequestRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createQuoteRequestDto)).rejects.toThrow('Database error');
    });
  });
});