import { Injectable } from '@nestjs/common';
import { IUseCase } from '../../../shared/application/use-case.interface';
import { IFinancingRepository } from '../../../domain/financing/financing.repository.interface';
import { Financing, PaymentStatus } from '../../../domain/financing/financing.entity';

export interface CreateFinancingRequest {
  userId: string;
  description: string;
  totalAmount: number;
  downPayment: number;
  interestRate: number;
  installments: number;
  dueDay: number;
  startDate: Date;
  type: string;
  notes?: string;
}

export interface CreateFinancingResponse {
  id: string;
  description: string;
  totalAmount: number;
  monthlyPayment: number;
}

@Injectable()
export class CreateFinancingUseCase implements IUseCase<CreateFinancingRequest, CreateFinancingResponse> {
  constructor(private readonly financingRepository: IFinancingRepository) {}

  async execute(request: CreateFinancingRequest): Promise<CreateFinancingResponse> {
    const endDate = new Date(request.startDate);
    endDate.setMonth(endDate.getMonth() + request.installments);

    const financedAmount = request.totalAmount - request.downPayment;
    const monthlyInterestRate = request.interestRate / 100 / 12;
    const monthlyPayment = this.calculateMonthlyPayment(
      financedAmount,
      monthlyInterestRate,
      request.installments,
    );

    const financing = Financing.create({
      userId: request.userId,
      description: request.description,
      totalAmount: request.totalAmount,
      downPayment: request.downPayment,
      remainingAmount: financedAmount,
      interestRate: request.interestRate,
      installments: request.installments,
      paidInstallments: 0,
      monthlyPayment,
      dueDay: request.dueDay,
      startDate: request.startDate,
      endDate,
      status: PaymentStatus.PENDING,
      type: request.type,
      notes: request.notes,
    });

    const savedFinancing = await this.financingRepository.save(financing);

    return {
      id: savedFinancing.id,
      description: savedFinancing.description,
      totalAmount: savedFinancing.totalAmount,
      monthlyPayment: savedFinancing.monthlyPayment,
    };
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
    if (monthlyRate === 0) {
      return principal / months;
    }
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }
}


