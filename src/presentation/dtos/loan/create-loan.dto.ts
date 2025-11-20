import { IsString, IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @IsNumber()
  @Min(0)
  interestRate: number;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}


