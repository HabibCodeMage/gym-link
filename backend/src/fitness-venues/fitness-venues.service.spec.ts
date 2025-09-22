import { Test, TestingModule } from '@nestjs/testing';
import { FitnessVenuesService } from './fitness-venues.service';

describe('FitnessVenuesService', () => {
  let service: FitnessVenuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FitnessVenuesService],
    }).compile();

    service = module.get<FitnessVenuesService>(FitnessVenuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
