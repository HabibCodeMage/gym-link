import { Test, TestingModule } from '@nestjs/testing';
import { FitnessVenuesController } from './fitness-venues.controller';

describe('FitnessVenuesController', () => {
  let controller: FitnessVenuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitnessVenuesController],
    }).compile();

    controller = module.get<FitnessVenuesController>(FitnessVenuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
