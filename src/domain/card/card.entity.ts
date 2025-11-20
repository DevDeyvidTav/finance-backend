import { Entity } from '../../shared/domain/entity.base';
import { InvalidEntityException } from '../../shared/domain/exceptions/domain.exception';
import { randomUUID } from 'crypto';

export interface CardProps {
  userId: string;
  name: string;
  lastFourDigits?: string;
  brand?: string;
  limit?: number;
  closingDay: number;
  dueDay: number;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card extends Entity<CardProps> {
  private constructor(props: CardProps, id?: string) {
    super(props, id);
    this.validate();
  }

  public static create(props: CardProps, id?: string): Card {
    return new Card(props, id);
  }

  private validate(): void {
    if (this.props.closingDay < 1 || this.props.closingDay > 31) {
      throw new InvalidEntityException('Closing day must be between 1 and 31');
    }

    if (this.props.dueDay < 1 || this.props.dueDay > 31) {
      throw new InvalidEntityException('Due day must be between 1 and 31');
    }

    if (this.props.limit && this.props.limit < 0) {
      throw new InvalidEntityException('Limit must be a positive number');
    }
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get lastFourDigits(): string | undefined {
    return this.props.lastFourDigits;
  }

  get brand(): string | undefined {
    return this.props.brand;
  }

  get limit(): number | undefined {
    return this.props.limit;
  }

  get closingDay(): number {
    return this.props.closingDay;
  }

  get dueDay(): number {
    return this.props.dueDay;
  }

  get color(): string | undefined {
    return this.props.color;
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


