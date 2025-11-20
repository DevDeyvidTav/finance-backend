import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { ITransactionRepository } from '../../../domain/transaction/transaction.repository.interface';
import { TransactionType, PaymentStatus } from '../../../domain/transaction/transaction.entity';

export interface GetUserTransactionsRequest {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TransactionDto {
  id: string;
  cardId?: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  status: PaymentStatus;
  installments: number;
  currentInstallment: number;
  isRecurring: boolean;
  notes?: string;
}

@Injectable()
export class GetUserTransactionsUseCase implements IUseCase<GetUserTransactionsRequest, TransactionDto[]> {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(request: GetUserTransactionsRequest): Promise<TransactionDto[]> {
    let transactions;

    if (request.startDate && request.endDate) {
      transactions = await this.transactionRepository.findByUserIdAndDateRange(
        request.userId,
        request.startDate,
        request.endDate,
      );
    } else {
      transactions = await this.transactionRepository.findByUserId(request.userId);
    }

    return transactions.map(transaction => ({
      id: transaction.id,
      cardId: transaction.cardId,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      status: transaction.status,
      installments: transaction.installments,
      currentInstallment: transaction.currentInstallment,
      isRecurring: transaction.isRecurring,
      notes: transaction.notes,
    }));
  }
}


