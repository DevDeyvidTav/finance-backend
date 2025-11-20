import { Entity } from '../../shared/domain/entity.base';
import { InvalidEntityException } from '../../shared/domain/exceptions/domain.exception';
import { randomUUID } from 'crypto';

export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export interface TransactionProps {
  userId: string;
  cardId?: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  status: PaymentStatus;
  installments: number;
  currentInstallment: number;
  isRecurring: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transaction extends Entity<TransactionProps> {
  private constructor(props: TransactionProps, id?: string) {
    super(props, id);
    this.validate();
  }

  public static create(props: TransactionProps, id?: string): Transaction {
    return new Transaction(props, id);
  }

  private validate(): void {
    if (this.props.amount <= 0) {
      throw new InvalidEntityException('Amount must be greater than 0');
    }

    if (this.props.installments < 1) {
      throw new InvalidEntityException('Installments must be at least 1');
    }

    if (this.props.currentInstallment < 1 || this.props.currentInstallment > this.props.installments) {
      throw new InvalidEntityException('Current installment must be between 1 and total installments');
    }
  }

  get userId(): string {
    return this.props.userId;
  }

  get cardId(): string | undefined {
    return this.props.cardId;
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get category(): string {
    return this.props.category;
  }

  get date(): Date {
    return this.props.date;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get installments(): number {
    return this.props.installments;
  }

  get currentInstallment(): number {
    return this.props.currentInstallment;
  }

  get isRecurring(): boolean {
    return this.props.isRecurring;
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

  public markAsPaid(): void {
    this.props.status = PaymentStatus.PAID;
  }

  public markAsOverdue(): void {
    this.props.status = PaymentStatus.OVERDUE;
  }

  protected generateId(): string {
    return randomUUID();
  }
}


