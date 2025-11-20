import { IRepository } from '../../shared/domain/repository.interface';
import { Transaction } from './transaction.entity';

export interface ITransactionRepository extends IRepository<Transaction> {
  findByUserId(userId: string): Promise<Transaction[]>;
  findByCardId(cardId: string): Promise<Transaction[]>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
}


