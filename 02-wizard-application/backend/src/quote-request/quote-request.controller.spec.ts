import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRequestController, CreateQuoteRequestDto } from './quote-request.controller';
import { QuoteRequestService } from './quote-request.service';

describe('QuoteRequestController', () => {
  let controller: QuoteRequestController;
  let service: QuoteRequestService;

  const mockQuoteRequestService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteRequestController],
      providers: [
        {
          provide: QuoteRequestService,
          useValue: mockQuoteRequestService,
        },
      ],
    }).compile();

    controller = module.get<QuoteRequestController>(QuoteRequestController);
    service = module.get<QuoteRequestService>(QuoteRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedResponse = {
        success: true,
        quoteRequestId: 'quote_123_abc',
        message: 'Quote request submitted successfully. Our team will contact you soon.'
      };

      mockQuoteRequestService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(createQuoteRequestDto);

      expect(result).toEqual(expectedResponse);
      expect(mockQuoteRequestService.create).toHaveBeenCalledWith(createQuoteRequestDto);
    });

    it('should handle service errors', async () => {
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

      mockQuoteRequestService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createQuoteRequestDto)).rejects.toThrow('Service error');
    });

    it('should handle partial form data', async () => {
      const createQuoteRequestDto: CreateQuoteRequestDto = {
        sessionId: 'test-session',
        formData: {
          address: {
            street: '123 Main St',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701'
          },
          units: 'dont-know',
          systemType: 'dont-know',
          heatingType: 'dont-know',
          contactInfo: {
            name: 'John Doe',
            phone: '555-1234',
            email: 'john@example.com'
          }
        }
      };

      const expectedResponse = {
        success: true,
        quoteRequestId: 'quote_456_def',
        message: 'Quote request submitted successfully. Our team will contact you soon.'
      };

      mockQuoteRequestService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(createQuoteRequestDto);

      expect(result).toEqual(expectedResponse);
      expect(mockQuoteRequestService.create).toHaveBeenCalledWith(createQuoteRequestDto);
    });
  });
});
