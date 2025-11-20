import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/transaction/transaction.repository.interface';
import { Transaction, TransactionType, PaymentStatus } from '../../domain/transaction/transaction.entity';
import { PrismaService } from '../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) return null;
    return this.toDomain(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany();
    return transactions.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({ 
      where: { userId },
      orderBy: { date: 'desc' }
    });
    return transactions.map(this.toDomain);
  }

  async findByCardId(cardId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({ 
      where: { cardId },
      orderBy: { date: 'desc' }
    });
    return transactions.map(this.toDomain);
  }

  async findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
    return transactions.map(this.toDomain);
  }

  async save(entity: Transaction): Promise<Transaction> {
    const data = {
      userId: entity.userId,
      cardId: entity.cardId,
      description: entity.description,
      amount: new Decimal(entity.amount),
      type: entity.type,
      category: entity.category,
      date: entity.date,
      status: entity.status,
      installments: entity.installments,
      currentInstallment: entity.currentInstallment,
      isRecurring: entity.isRecurring,
      notes: entity.notes,
    };

    const transaction = await this.prisma.transaction.create({ data });
    return this.toDomain(transaction);
  }

  async update(entity: Transaction): Promise<Transaction> {
    const data = {
      description: entity.description,
      amount: new Decimal(entity.amount),
      type: entity.type,
      category: entity.category,
      date: entity.date,
      status: entity.status,
      currentInstallment: entity.currentInstallment,
      notes: entity.notes,
    };

    const transaction = await this.prisma.transaction.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(transaction);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  private toDomain(prismaTransaction: any): Transaction {
    return Transaction.create(
      {
        userId: prismaTransaction.userId,
        cardId: prismaTransaction.cardId,
        description: prismaTransaction.description,
        amount: parseFloat(prismaTransaction.amount.toString()),
        type: prismaTransaction.type as TransactionType,
        category: prismaTransaction.category,
        date: prismaTransaction.date,
        status: prismaTransaction.status as PaymentStatus,
        installments: prismaTransaction.installments,
        currentInstallment: prismaTransaction.currentInstallment,
        isRecurring: prismaTransaction.isRecurring,
        notes: prismaTransaction.notes,
        createdAt: prismaTransaction.createdAt,
        updatedAt: prismaTransaction.updatedAt,
      },
      prismaTransaction.id,
    );
  }
}


