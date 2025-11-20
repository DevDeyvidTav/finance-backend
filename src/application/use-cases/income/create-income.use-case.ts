import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { IIncomeRepository } from '../../../domain/income/income.repository.interface';
import { Income } from '../../../domain/income/income.entity';

export interface CreateIncomeRequest {
  userId: string;
  description: string;
  amount: number;
  receivedDate: Date;
  isRecurring?: boolean;
  category?: string;
  notes?: string;
}

export interface CreateIncomeResponse {
  id: string;
  description: string;
  amount: number;
  receivedDate: Date;
}

@Injectable()
export class CreateIncomeUseCase implements IUseCase<CreateIncomeRequest, CreateIncomeResponse> {
  constructor(private readonly incomeRepository: IIncomeRepository) {}

  async execute(request: CreateIncomeRequest): Promise<CreateIncomeResponse> {
    const income = Income.create({
      userId: request.userId,
      description: request.description,
      amount: request.amount,
      receivedDate: request.receivedDate,
      isRecurring: request.isRecurring || false,
      category: request.category || 'salary',
      notes: request.notes,
    });

    const savedIncome = await this.incomeRepository.save(income);

    return {
      id: savedIncome.id,
      description: savedIncome.description,
      amount: savedIncome.amount,
      receivedDate: savedIncome.receivedDate,
    };
  }
}


