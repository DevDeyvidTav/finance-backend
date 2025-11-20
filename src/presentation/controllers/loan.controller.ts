import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import { CreateLoanDto } from '../dtos/loan/create-loan.dto';
import { CreateLoanUseCase } from '../../application/use-cases/loan/create-loan.use-case';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private readonly createLoanUseCase: CreateLoanUseCase) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateLoanDto) {
    return this.createLoanUseCase.execute({
      userId: user.userId,
      ...dto,
      startDate: new Date(dto.startDate),
    });
  }
}


