import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import { CreateTransactionDto } from '../dtos/transaction/create-transaction.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/transaction/create-transaction.use-case';
import { GetUserTransactionsUseCase } from '../../application/use-cases/transaction/get-user-transactions.use-case';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getUserTransactionsUseCase: GetUserTransactionsUseCase,
  ) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute({
      userId: user.userId,
      ...dto,
      date: new Date(dto.date),
    });
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.getUserTransactionsUseCase.execute({
      userId: user.userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}


