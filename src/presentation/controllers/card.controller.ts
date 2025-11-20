import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import { CreateCardDto } from '../dtos/card/create-card.dto';
import { CreateCardUseCase } from '../../application/use-cases/card/create-card.use-case';
import { GetUserCardsUseCase } from '../../application/use-cases/card/get-user-cards.use-case';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly getUserCardsUseCase: GetUserCardsUseCase,
  ) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateCardDto) {
    return this.createCardUseCase.execute({
      userId: user.userId,
      ...dto,
    });
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.getUserCardsUseCase.execute({ userId: user.userId });
  }
}


