import { IRepository } from '../../shared/domain/repository.interface';
import { Income } from './income.entity';

export interface IIncomeRepository extends IRepository<Income> {
  findByUserId(userId: string): Promise<Income[]>;
  findRecurringByUserId(userId: string): Promise<Income[]>;
}


