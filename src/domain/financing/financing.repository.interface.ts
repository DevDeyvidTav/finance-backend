import { IRepository } from '../../shared/domain/repository.interface';
import { Financing } from './financing.entity';

export interface IFinancingRepository extends IRepository<Financing> {
  findByUserId(userId: string): Promise<Financing[]>;
  findActiveByUserId(userId: string): Promise<Financing[]>;
}


