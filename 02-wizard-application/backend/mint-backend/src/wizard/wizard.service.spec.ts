import { Test, TestingModule } from '@nestjs/testing';
import { WizardService } from './wizard.service';

describe('WizardService', () => {
  let service: WizardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WizardService],
    }).compile();

    service = module.get<WizardService>(WizardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
