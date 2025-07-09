import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsController', () => {
  let controller: LeadsController;
  let service: LeadsService;

  const mockLeadsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        {
          provide: LeadsService,
          useValue: mockLeadsService,
        },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
    service = module.get<LeadsService>(LeadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call leadsService.create and return the result', () => {
      const createLeadDto = {
        address: '456 Oak St',
        phone: '555-0123',
      };

      const expectedLead = {
        id: 2,
        address: '456 Oak St',
        phone: '555-0123',
      };

      mockLeadsService.create.mockReturnValue(expectedLead);

      const result = controller.create(createLeadDto);

      expect(service.create).toHaveBeenCalledWith(createLeadDto);
      expect(result).toEqual(expectedLead);
    });

    it('should handle empty input', () => {
      const createLeadDto = {};

      const expectedLead = {
        id: 1,
        address: undefined,
        phone: undefined,
      };

      mockLeadsService.create.mockReturnValue(expectedLead);

      const result = controller.create(createLeadDto);

      expect(service.create).toHaveBeenCalledWith(createLeadDto);
      expect(result).toEqual(expectedLead);
    });
  });
});
