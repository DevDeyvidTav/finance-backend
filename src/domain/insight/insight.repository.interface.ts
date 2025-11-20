import { IRepository } from '../../shared/domain/repository.interface';
import { FinancialInsight } from './insight.entity';

export interface IInsightRepository extends IRepository<FinancialInsight> {
  findByUserId(userId: string): Promise<FinancialInsight[]>;
  findUnreadByUserId(userId: string): Promise<FinancialInsight[]>;
}


