import { Injectable } from '@nestjs/common';
import { ILoanRepository } from '../../domain/loan/loan.repository.interface';
import { Loan, PaymentStatus } from '../../domain/loan/loan.entity';
import { PrismaService } from '../database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class LoanRepository implements ILoanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Loan | null> {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) return null;
    return this.toDomain(loan);
  }

  async findAll(): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany();
    return loans.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany({ 
      where: { userId },
      orderBy: { startDate: 'desc' }
    });
    return loans.map(this.toDomain);
  }

  async findActiveByUserId(userId: string): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany({
      where: { 
        userId,
        status: { notIn: ['PAID', 'CANCELLED'] }
      },
      orderBy: { startDate: 'desc' },
    });
    return loans.map(this.toDomain);
  }

  async save(entity: Loan): Promise<Loan> {
    const data = {
      userId: entity.userId,
      description: entity.description,
      totalAmount: new Decimal(entity.totalAmount),
      remainingAmount: new Decimal(entity.remainingAmount),
      interestRate: new Decimal(entity.interestRate),
      installments: entity.installments,
      paidInstallments: entity.paidInstallments,
      dueDay: entity.dueDay,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      notes: entity.notes,
    };

    const loan = await this.prisma.loan.create({ data });
    return this.toDomain(loan);
  }

  async update(entity: Loan): Promise<Loan> {
    const data = {
      description: entity.description,
      remainingAmount: new Decimal(entity.remainingAmount),
      paidInstallments: entity.paidInstallments,
      status: entity.status,
      notes: entity.notes,
    };

    const loan = await this.prisma.loan.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(loan);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.loan.delete({ where: { id } });
  }

  private toDomain(prismaLoan: any): Loan {
    return Loan.create(
      {
        userId: prismaLoan.userId,
        description: prismaLoan.description,
        totalAmount: parseFloat(prismaLoan.totalAmount.toString()),
        remainingAmount: parseFloat(prismaLoan.remainingAmount.toString()),
        interestRate: parseFloat(prismaLoan.interestRate.toString()),
        installments: prismaLoan.installments,
        paidInstallments: prismaLoan.paidInstallments,
        dueDay: prismaLoan.dueDay,
        startDate: prismaLoan.startDate,
        endDate: prismaLoan.endDate,
        status: prismaLoan.status as PaymentStatus,
        notes: prismaLoan.notes,
        createdAt: prismaLoan.createdAt,
        updatedAt: prismaLoan.updatedAt,
      },
      prismaLoan.id,
    );
  }
}


