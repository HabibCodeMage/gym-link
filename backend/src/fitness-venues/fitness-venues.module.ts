import { Module } from '@nestjs/common';
import { FitnessVenuesController } from './fitness-venues.controller';
import { FitnessVenuesService } from './fitness-venues.service';

@Module({
  controllers: [FitnessVenuesController],
  providers: [FitnessVenuesService],
})
export class FitnessVenuesModule {}
