import { IRepository } from '../../shared/domain/repository.interface';
import { Card } from './card.entity';

export interface ICardRepository extends IRepository<Card> {
  findByUserId(userId: string): Promise<Card[]>;
}


