import { Injectable } from '@nestjs/common';
import { IFinancingRepository } from '../../domain/financing/financing.repository.interface';
import { Financing, PaymentStatus } from '../../domain/financing/financing.entity';
import { PrismaService } from '../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FinancingRepository implements IFinancingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Financing | null> {
    const financing = await this.prisma.financing.findUnique({ where: { id } });
    if (!financing) return null;
    return this.toDomain(financing);
  }

  async findAll(): Promise<Financing[]> {
    const financings = await this.prisma.financing.findMany();
    return financings.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Financing[]> {
    const financings = await this.prisma.financing.findMany({ 
      where: { userId },
      orderBy: { startDate: 'desc' }
    });
    return financings.map(this.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<Financing[]> {
    const financings = await this.prisma.financing.findMany({
      where: { 
        userId,
        status: { notIn: ['PAID', 'CANCELLED'] }
      },
      orderBy: { startDate: 'desc' },
    });
    return financings.map(this.toDomain);
  }

  async save(entity: Financing): Promise<Financing> {
    const data = {
      userId: entity.userId,
      description: entity.description,
      totalAmount: new Decimal(entity.totalAmount),
      downPayment: new Decimal(entity.downPayment),
      remainingAmount: new Decimal(entity.remainingAmount),
      interestRate: new Decimal(entity.interestRate),
      installments: entity.installments,
      paidInstallments: entity.paidInstallments,
      monthlyPayment: new Decimal(entity.monthlyPayment),
      dueDay: entity.dueDay,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      type: entity.type,
      notes: entity.notes,
    };

    const financing = await this.prisma.financing.create({ data });
    return this.toDomain(financing);
  }

  async update(entity: Financing): Promise<Financing> {
    const data = {
      description: entity.description,
      remainingAmount: new Decimal(entity.remainingAmount),
      paidInstallments: entity.paidInstallments,
      status: entity.status,
      notes: entity.notes,
    };

    const financing = await this.prisma.financing.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(financing);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.financing.delete({ where: { id } });
  }

  private toDomain(prismaFinancing: any): Financing {
    return Financing.create(
      {
        userId: prismaFinancing.userId,
        description: prismaFinancing.description,
        totalAmount: parseFloat(prismaFinancing.totalAmount.toString()),
        downPayment: parseFloat(prismaFinancing.downPayment.toString()),
        remainingAmount: parseFloat(prismaFinancing.remainingAmount.toString()),
        interestRate: parseFloat(prismaFinancing.interestRate.toString()),
        installments: prismaFinancing.installments,
        paidInstallments: prismaFinancing.paidInstallments,
        monthlyPayment: parseFloat(prismaFinancing.monthlyPayment.toString()),
        dueDay: prismaFinancing.dueDay,
        startDate: prismaFinancing.startDate,
        endDate: prismaFinancing.endDate,
        status: prismaFinancing.status as PaymentStatus,
        type: prismaFinancing.type,
        notes: prismaFinancing.notes,
        createdAt: prismaFinancing.createdAt,
        updatedAt: prismaFinancing.updatedAt,
      },
      prismaFinancing.id,
    );
  }
}


