import { Injectable } from '@nestjs/common';
import { IInsightRepository } from '../../domain/insight/insight.repository.interface';
import { FinancialInsight, InsightType } from '../../domain/insight/insight.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class InsightRepository implements IInsightRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FinancialInsight | null> {
    const insight = await this.prisma.financialInsight.findUnique({ where: { id } });
    if (!insight) return null;
    return this.toDomain(insight);
  }

  async findAll(): Promise<FinancialInsight[]> {
    const insights = await this.prisma.financialInsight.findMany();
    return insights.map(this.toDomain);
  }

  async findByUserId(userId: string): Promise<FinancialInsight[]> {
    const insights = await this.prisma.financialInsight.findMany({ 
      where: { userId },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    return insights.map(this.toDomain);
  }

  async findUnreadByUserId(userId: string): Promise<FinancialInsight[]> {
    const insights = await this.prisma.financialInsight.findMany({
      where: { userId, isRead: false },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
    });
    return insights.map(this.toDomain);
  }

  async save(entity: FinancialInsight): Promise<FinancialInsight> {
    const data = {
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      priority: entity.priority,
      isRead: entity.isRead,
      metadata: entity.metadata as any,
    };

    const insight = await this.prisma.financialInsight.create({ data });
    return this.toDomain(insight);
  }

  async update(entity: FinancialInsight): Promise<FinancialInsight> {
    const data = {
      isRead: entity.isRead,
    };

    const insight = await this.prisma.financialInsight.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(insight);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.financialInsight.delete({ where: { id } });
  }

  private toDomain(prismaInsight: any): FinancialInsight {
    return FinancialInsight.create(
      {
        userId: prismaInsight.userId,
        title: prismaInsight.title,
        description: prismaInsight.description,
        type: prismaInsight.type as InsightType,
        priority: prismaInsight.priority,
        isRead: prismaInsight.isRead,
        metadata: prismaInsight.metadata as Record<string, any>,
        createdAt: prismaInsight.createdAt,
      },
      prismaInsight.id,
    );
  }
}


