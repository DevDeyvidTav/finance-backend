import { Entity } from '../../shared/domain/entity.base';
import { InvalidEntityException } from '../../shared/domain/exceptions/domain.exception';
import { randomUUID } from 'crypto';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface LoanProps {
  userId: string;
  description: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  installments: number;
  paidInstallments: number;
  dueDay: number;
  startDate: Date;
  endDate: Date;
  status: PaymentStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Loan extends Entity<LoanProps> {
  private constructor(props: LoanProps, id?: string) {
    super(props, id);
    this.validate();
  }

  public static create(props: LoanProps, id?: string): Loan {
    return new Loan(props, id);
  }

  private validate(): void {
    if (this.props.totalAmount <= 0) {
      throw new InvalidEntityException('Total amount must be greater than 0');
    }

    if (this.props.interestRate < 0) {
      throw new InvalidEntityException('Interest rate cannot be negative');
    }

    if (this.props.installments < 1) {
      throw new InvalidEntityException('Installments must be at least 1');
    }

    if (this.props.dueDay < 1 || this.props.dueDay > 31) {
      throw new InvalidEntityException('Due day must be between 1 and 31');
    }
  }

  get userId(): string {
    return this.props.userId;
  }

  get description(): string {
    return this.props.description;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get remainingAmount(): number {
    return this.props.remainingAmount;
  }

  get interestRate(): number {
    return this.props.interestRate;
  }

  get installments(): number {
    return this.props.installments;
  }

  get paidInstallments(): number {
    return this.props.paidInstallments;
  }

  get dueDay(): number {
    return this.props.dueDay;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  protected generateId(): string {
    return randomUUID();
  }
}


