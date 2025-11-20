import { Entity } from '../../shared/domain/entity.base';
import { randomUUID } from 'crypto';

export enum InsightType {
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  SUGGESTION = 'SUGGESTION',
}

export interface InsightProps {
  userId: string;
  title: string;
  description: string;
  type: InsightType;
  priority: number;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

export class FinancialInsight extends Entity<InsightProps> {
  private constructor(props: InsightProps, id?: string) {
    super(props, id);
  }

  public static create(props: InsightProps, id?: string): FinancialInsight {
    return new FinancialInsight(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get type(): InsightType {
    return this.props.type;
  }

  get priority(): number {
    return this.props.priority;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  public markAsRead(): void {
    this.props.isRead = true;
  }

  protected generateId(): string {
    return randomUUID();
  }
}


