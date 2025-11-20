import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { ICardRepository } from '../../../domain/card/card.repository.interface';

export interface GetUserCardsRequest {
  userId: string;
}

export interface CardDto {
  id: string;
  name: string;
  lastFourDigits?: string;
  brand?: string;
  limit?: number;
  closingDay: number;
  dueDay: number;
  color?: string;
}

@Injectable()
export class GetUserCardsUseCase implements IUseCase<GetUserCardsRequest, CardDto[]> {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(request: GetUserCardsRequest): Promise<CardDto[]> {
    const cards = await this.cardRepository.findByUserId(request.userId);

    return cards.map(card => ({
      id: card.id,
      name: card.name,
      lastFourDigits: card.lastFourDigits,
      brand: card.brand,
      limit: card.limit,
      closingDay: card.closingDay,
      dueDay: card.dueDay,
      color: card.color,
    }));
  }
}


