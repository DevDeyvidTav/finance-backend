import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import { CreateFinancingDto } from '../dtos/financing/create-financing.dto';
import { CreateFinancingUseCase } from '../../application/use-cases/financing/create-financing.use-case';

@Controller('financings')
@UseGuards(JwtAuthGuard)
export class FinancingController {
  constructor(private readonly createFinancingUseCase: CreateFinancingUseCase) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateFinancingDto) {
    return this.createFinancingUseCase.execute({
      userId: user.userId,
      ...dto,
      startDate: new Date(dto.startDate),
    });
  }
}


