import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { ILoanRepository } from '../../../domain/loan/loan.repository.interface';
import { Loan, PaymentStatus } from '../../../domain/loan/loan.entity';

export interface CreateLoanRequest {
  userId: string;
  description: string;
  totalAmount: number;
  interestRate: number;
  installments: number;
  dueDay: number;
  startDate: Date;
  notes?: string;
}

export interface CreateLoanResponse {
  id: string;
  description: string;
  totalAmount: number;
  installments: number;
}

@Injectable()
export class CreateLoanUseCase implements IUseCase<CreateLoanRequest, CreateLoanResponse> {
  constructor(private readonly loanRepository: ILoanRepository) {}

  async execute(request: CreateLoanRequest): Promise<CreateLoanResponse> {
    const endDate = new Date(request.startDate);
    endDate.setMonth(endDate.getMonth() + request.installments);

    const loan = Loan.create({
      userId: request.userId,
      description: request.description,
      totalAmount: request.totalAmount,
      remainingAmount: request.totalAmount,
      interestRate: request.interestRate,
      installments: request.installments,
      paidInstallments: 0,
      dueDay: request.dueDay,
      startDate: request.startDate,
      endDate,
      status: PaymentStatus.PENDING,
      notes: request.notes,
    });

    const savedLoan = await this.loanRepository.save(loan);

    return {
      id: savedLoan.id,
      description: savedLoan.description,
      totalAmount: savedLoan.totalAmount,
      installments: savedLoan.installments,
    };
  }
}


