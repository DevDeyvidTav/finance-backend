import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import { CreateIncomeDto } from '../dtos/income/create-income.dto';
import { CreateIncomeUseCase } from '../../application/use-cases/income/create-income.use-case';

@Controller('incomes')
@UseGuards(JwtAuthGuard)
export class IncomeController {
  constructor(private readonly createIncomeUseCase: CreateIncomeUseCase) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateIncomeDto) {
    return this.createIncomeUseCase.execute({
      userId: user.userId,
      ...dto,
      receivedDate: new Date(dto.receivedDate),
    });
  }
}


