import { Controller, Get, Query, Param } from '@nestjs/common';
import { FitnessVenuesService } from './fitness-venues.service';
import { SearchFitnessVenuesDto } from './dto/fitness-venue.dto';

@Controller('fitness-venues')
export class FitnessVenuesController {
  constructor(private readonly fitnessVenuesService: FitnessVenuesService) {}

  @Get()
  findAll() {
    return this.fitnessVenuesService.findAll();
  }

  @Get('search')
  search(@Query() searchDto: SearchFitnessVenuesDto) {
    return this.fitnessVenuesService.search(searchDto);
  }

  @Get('filters')
  getFilterOptions() {
    return this.fitnessVenuesService.getFilterOptions();
  }

  @Get('categories')
  getCategories() {
    return this.fitnessVenuesService.getCategories();
  }

  @Get('vibes')
  getVibes() {
    return this.fitnessVenuesService.getVibes();
  }

  @Get('cities')
  getCities() {
    return this.fitnessVenuesService.getCities();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fitnessVenuesService.findOne(id);
  }
}
