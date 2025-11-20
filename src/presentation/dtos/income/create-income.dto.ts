import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min } from 'class-validator';

export class CreateIncomeDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  receivedDate: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}


