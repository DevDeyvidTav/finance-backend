import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateCardDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  lastFourDigits?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  limit?: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  closingDay: number;

  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsOptional()
  @IsString()
  color?: string;
}


