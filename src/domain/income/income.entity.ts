import { Entity } from '../../shared/domain/entity.base';
import { InvalidEntityException } from '../../shared/domain/exceptions/domain.exception';
import { randomUUID } from 'crypto';

export interface IncomeProps {
  userId: string;
  description: string;
  amount: number;
  receivedDate: Date;
  isRecurring: boolean;
  category: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Income extends Entity<IncomeProps> {
  private constructor(props: IncomeProps, id?: string) {
    super(props, id);
    this.validate();
  }

  public static create(props: IncomeProps, id?: string): Income {
    return new Income(props, id);
  }

  private validate(): void {
    if (this.props.amount <= 0) {
      throw new InvalidEntityException('Amount must be greater than 0');
    }
  }

  get userId(): string {
    return this.props.userId;
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): number {
    return this.props.amount;
  }

  get receivedDate(): Date {
    return this.props.receivedDate;
  }

  get isRecurring(): boolean {
    return this.props.isRecurring;
  }

  get category(): string {
    return this.props.category;
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


