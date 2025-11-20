import { IRepository } from '../../shared/domain/repository.interface';
import { Loan } from './loan.entity';

export interface ILoanRepository extends IRepository<Loan> {
  findByUserId(userId: string): Promise<Loan[]>;
  findActiveByUserId(userId: string): Promise<Loan[]>;
}


