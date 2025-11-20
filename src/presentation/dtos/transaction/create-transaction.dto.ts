import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, Min } from 'class-validator';
import { TransactionType } from '../../../domain/transaction/transaction.entity';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  cardId?: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  category: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  installments?: number;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}


