import { Injectable } from '@nestjs/common';
import { ICardRepository } from '../../domain/card/card.repository.interface';
import { Card } from '../../domain/card/card.entity';
import { PrismaService } from '../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CardRepository implements ICardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Card | null> {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) return null;
    return this.toDomain(card);
  }

  async findAll(): Promise<Card[]> {
    const cards = await this.prisma.card.findMany();
    return cards.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({ where: { userId } });
    return cards.map(this.toDomain);
  }

  async save(entity: Card): Promise<Card> {
    const data = {
      userId: entity.userId,
      name: entity.name,
      lastFourDigits: entity.lastFourDigits,
      brand: entity.brand,
      limit: entity.limit ? new Decimal(entity.limit) : null,
      closingDay: entity.closingDay,
      dueDay: entity.dueDay,
      color: entity.color,
    };

    const card = await this.prisma.card.create({ data });
    return this.toDomain(card);
  }

  async update(entity: Card): Promise<Card> {
    const data = {
      name: entity.name,
      lastFourDigits: entity.lastFourDigits,
      brand: entity.brand,
      limit: entity.limit ? new Decimal(entity.limit) : null,
      closingDay: entity.closingDay,
      dueDay: entity.dueDay,
      color: entity.color,
    };

    const card = await this.prisma.card.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(card);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.card.delete({ where: { id } });
  }

  private toDomain(prismaCard: any): Card {
    return Card.create(
      {
        userId: prismaCard.userId,
        name: prismaCard.name,
        lastFourDigits: prismaCard.lastFourDigits,
        brand: prismaCard.brand,
        limit: prismaCard.limit ? parseFloat(prismaCard.limit.toString()) : undefined,
        closingDay: prismaCard.closingDay,
        dueDay: prismaCard.dueDay,
        color: prismaCard.color,
        createdAt: prismaCard.createdAt,
        updatedAt: prismaCard.updatedAt,
      },
      prismaCard.id,
    );
  }
}


