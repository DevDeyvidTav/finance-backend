import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { ITransactionRepository } from '../../../domain/transaction/transaction.repository.interface';
import { Transaction, TransactionType, PaymentStatus } from '../../../domain/transaction/transaction.entity';

export interface CreateTransactionRequest {
  userId: string;
  cardId?: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  installments?: number;
  isRecurring?: boolean;
  notes?: string;
}

export interface CreateTransactionResponse {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

@Injectable()
export class CreateTransactionUseCase implements IUseCase<CreateTransactionRequest, CreateTransactionResponse> {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const transaction = Transaction.create({
      userId: request.userId,
      cardId: request.cardId,
      description: request.description,
      amount: request.amount,
      type: request.type,
      category: request.category,
      date: request.date,
      status: PaymentStatus.PENDING,
      installments: request.installments || 1,
      currentInstallment: 1,
      isRecurring: request.isRecurring || false,
      notes: request.notes,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    return {
      id: savedTransaction.id,
      description: savedTransaction.description,
      amount: savedTransaction.amount,
      date: savedTransaction.date,
    };
  }
}


