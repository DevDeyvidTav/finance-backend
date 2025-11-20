import { Controller, Get, Post, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import { FinancialIntelligenceService } from '../../application/services/financial-intelligence.service';
import { IInsightRepository } from '../../domain/insight/insight.repository.interface';

const INSIGHT_REPOSITORY = 'IInsightRepository';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly financialIntelligenceService: FinancialIntelligenceService,
    @Inject(INSIGHT_REPOSITORY)
    private readonly insightRepository: IInsightRepository,
  ) {}

  @Get('summary')
  async getSummary(@CurrentUser() user: any) {
    return this.financialIntelligenceService.getFinancialSummary(user.userId);
  }

  @Get('insights')
  async getInsights(@CurrentUser() user: any) {
    const insights = await this.insightRepository.findByUserId(user.userId);
    return insights.map(insight => ({
      id: insight.id,
      title: insight.title,
      description: insight.description,
      type: insight.type,
      priority: insight.priority,
      isRead: insight.isRead,
      createdAt: insight.createdAt,
    }));
  }

  @Post('insights/generate')
  async generateInsights(@CurrentUser() user: any) {
    await this.financialIntelligenceService.generateInsights(user.userId);
    return { message: 'Insights generated successfully' };
  }
}


