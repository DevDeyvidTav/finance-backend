import { Injectable } from '@nestjs/common';
import { IIncomeRepository } from '../../domain/income/income.repository.interface';
import { Income } from '../../domain/income/income.entity';
import { PrismaService } from '../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class IncomeRepository implements IIncomeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Income | null> {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income) return null;
    return this.toDomain(income);
  }

  async findAll(): Promise<Income[]> {
    const incomes = await this.prisma.income.findMany();
    return incomes.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Income[]> {
    const incomes = await this.prisma.income.findMany({ 
      where: { userId },
      orderBy: { receivedDate: 'desc' }
    });
    return incomes.map(this.toDomain);
  }

  async findRecurringByUserId(userId: string): Promise<Income[]> {
    const incomes = await this.prisma.income.findMany({
      where: { userId, isRecurring: true },
      orderBy: { receivedDate: 'desc' },
    });
    return incomes.map(this.toDomain);
  }

  async save(entity: Income): Promise<Income> {
    const data = {
      userId: entity.userId,
      description: entity.description,
      amount: new Decimal(entity.amount),
      receivedDate: entity.receivedDate,
      isRecurring: entity.isRecurring,
      category: entity.category,
      notes: entity.notes,
    };

    const income = await this.prisma.income.create({ data });
    return this.toDomain(income);
  }

  async update(entity: Income): Promise<Income> {
    const data = {
      description: entity.description,
      amount: new Decimal(entity.amount),
      receivedDate: entity.receivedDate,
      isRecurring: entity.isRecurring,
      category: entity.category,
      notes: entity.notes,
    };

    const income = await this.prisma.income.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(income);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.income.delete({ where: { id } });
  }

  private toDomain(prismaIncome: any): Income {
    return Income.create(
      {
        userId: prismaIncome.userId,
        description: prismaIncome.description,
        amount: parseFloat(prismaIncome.amount.toString()),
        receivedDate: prismaIncome.receivedDate,
        isRecurring: prismaIncome.isRecurring,
        category: prismaIncome.category,
        notes: prismaIncome.notes,
        createdAt: prismaIncome.createdAt,
        updatedAt: prismaIncome.updatedAt,
      },
      prismaIncome.id,
    );
  }
}


