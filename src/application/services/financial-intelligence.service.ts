import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../domain/transaction/transaction.repository.interface';
import { IIncomeRepository } from '../../domain/income/income.repository.interface';
import { ILoanRepository } from '../../domain/loan/loan.repository.interface';
import { IFinancingRepository } from '../../domain/financing/financing.repository.interface';
import { IInsightRepository } from '../../domain/insight/insight.repository.interface';
import { FinancialInsight, InsightType } from '../../domain/insight/insight.entity';
import { TransactionType } from '../../domain/transaction/transaction.entity';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  topExpenseCategories: { category: string; amount: number }[];
}

@Injectable()
export class FinancialIntelligenceService {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly incomeRepository: IIncomeRepository,
    private readonly loanRepository: ILoanRepository,
    private readonly financingRepository: IFinancingRepository,
    private readonly insightRepository: IInsightRepository,
  ) {}

  async generateInsights(userId: string): Promise<void> {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    const transactions = await this.transactionRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
    );

    const incomes = await this.incomeRepository.findByUserId(userId);
    const loans = await this.loanRepository.findActiveByUserId(userId);
    const financings = await this.financingRepository.findActiveByUserId(userId);

    // Calculate current month summary
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const income = incomes
      .filter(i => i.receivedDate >= startDate && i.receivedDate <= endDate)
      .reduce((sum, i) => sum + i.amount, 0);

    // Check high spending
    const lastMonthTransactions = await this.transactionRepository.findByUserIdAndDateRange(
      userId,
      startOfMonth(subMonths(now, 1)),
      endOfMonth(subMonths(now, 1)),
    );

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    if (expenses > lastMonthExpenses * 1.2) {
      await this.insightRepository.save(
        FinancialInsight.create({
          userId,
          title: 'Gastos acima da média',
          description: `Seus gastos este mês (R$ ${expenses.toFixed(2)}) estão 20% acima do mês passado. Considere revisar suas despesas.`,
          type: InsightType.WARNING,
          priority: 5,
          isRead: false,
          metadata: { expenses, lastMonthExpenses },
        }),
      );
    }

    // Check savings rate
    if (income > 0) {
      const savingsRate = ((income - expenses) / income) * 100;
      
      if (savingsRate < 10) {
        await this.insightRepository.save(
          FinancialInsight.create({
            userId,
            title: 'Taxa de poupança baixa',
            description: `Você está poupando apenas ${savingsRate.toFixed(1)}% da sua renda. Recomendamos pelo menos 20%.`,
            type: InsightType.SUGGESTION,
            priority: 4,
            isRead: false,
            metadata: { savingsRate, income, expenses },
          }),
        );
      } else if (savingsRate >= 30) {
        await this.insightRepository.save(
          FinancialInsight.create({
            userId,
            title: 'Excelente taxa de poupança!',
            description: `Parabéns! Você está poupando ${savingsRate.toFixed(1)}% da sua renda. Continue assim!`,
            type: InsightType.SUCCESS,
            priority: 3,
            isRead: false,
            metadata: { savingsRate },
          }),
        );
      }
    }

    // Check upcoming loan payments
    const totalLoanPayment = loans.reduce((sum, loan) => {
      const installmentValue = loan.remainingAmount / (loan.installments - loan.paidInstallments);
      return sum + installmentValue;
    }, 0);

    const totalFinancingPayment = financings.reduce((sum, f) => sum + f.monthlyPayment, 0);

    const totalDebtPayment = totalLoanPayment + totalFinancingPayment;

    if (totalDebtPayment > income * 0.4) {
      await this.insightRepository.save(
        FinancialInsight.create({
          userId,
          title: 'Alto comprometimento com dívidas',
          description: `Suas parcelas de empréstimos e financiamentos representam ${((totalDebtPayment / income) * 100).toFixed(1)}% da sua renda. Considere renegociar.`,
          type: InsightType.WARNING,
          priority: 5,
          isRead: false,
          metadata: { totalDebtPayment, income, percentage: (totalDebtPayment / income) * 100 },
        }),
      );
    }

    // Analyze expense categories
    const categoryExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a)[0];

    if (topCategory && topCategory[1] > expenses * 0.4) {
      await this.insightRepository.save(
        FinancialInsight.create({
          userId,
          title: `Alto gasto em ${topCategory[0]}`,
          description: `Você gastou R$ ${topCategory[1].toFixed(2)} em ${topCategory[0]}, representando ${((topCategory[1] / expenses) * 100).toFixed(1)}% dos seus gastos totais.`,
          type: InsightType.INFO,
          priority: 3,
          isRead: false,
          metadata: { category: topCategory[0], amount: topCategory[1], percentage: (topCategory[1] / expenses) * 100 },
        }),
      );
    }
  }

  async getFinancialSummary(userId: string): Promise<FinancialSummary> {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    const transactions = await this.transactionRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
    );

    const incomes = await this.incomeRepository.findByUserId(userId);

    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = incomes
      .filter(i => i.receivedDate >= startDate && i.receivedDate <= endDate)
      .reduce((sum, i) => sum + i.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

    // Calculate top expense categories
    const categoryExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topExpenseCategories = Object.entries(categoryExpenses)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      topExpenseCategories,
    };
  }
}


