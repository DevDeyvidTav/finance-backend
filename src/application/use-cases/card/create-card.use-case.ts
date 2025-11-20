import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { ICardRepository } from '../../../domain/card/card.repository.interface';
import { Card } from '../../../domain/card/card.entity';

export interface CreateCardRequest {
  userId: string;
  name: string;
  lastFourDigits?: string;
  brand?: string;
  limit?: number;
  closingDay: number;
  dueDay: number;
  color?: string;
}

export interface CreateCardResponse {
  id: string;
  name: string;
  closingDay: number;
  dueDay: number;
}

@Injectable()
export class CreateCardUseCase implements IUseCase<CreateCardRequest, CreateCardResponse> {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(request: CreateCardRequest): Promise<CreateCardResponse> {
    const card = Card.create({
      userId: request.userId,
      name: request.name,
      lastFourDigits: request.lastFourDigits,
      brand: request.brand,
      limit: request.limit,
      closingDay: request.closingDay,
      dueDay: request.dueDay,
      color: request.color,
    });

    const savedCard = await this.cardRepository.save(card);

    return {
      id: savedCard.id,
      name: savedCard.name,
      closingDay: savedCard.closingDay,
      dueDay: savedCard.dueDay,
    };
  }
}


