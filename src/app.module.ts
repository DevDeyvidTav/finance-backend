import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './infrastructure/database/prisma.service';

// Repositories
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CardRepository } from './infrastructure/repositories/card.repository';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { IncomeRepository } from './infrastructure/repositories/income.repository';
import { LoanRepository } from './infrastructure/repositories/loan.repository';
import { FinancingRepository } from './infrastructure/repositories/financing.repository';
import { InsightRepository } from './infrastructure/repositories/insight.repository';

// Use Cases
import { CreateCardUseCase } from './application/use-cases/card/create-card.use-case';
import { GetUserCardsUseCase } from './application/use-cases/card/get-user-cards.use-case';
import { CreateTransactionUseCase } from './application/use-cases/transaction/create-transaction.use-case';
import { GetUserTransactionsUseCase } from './application/use-cases/transaction/get-user-transactions.use-case';
import { CreateIncomeUseCase } from './application/use-cases/income/create-income.use-case';
import { CreateLoanUseCase } from './application/use-cases/loan/create-loan.use-case';
import { CreateFinancingUseCase } from './application/use-cases/financing/create-financing.use-case';

// Services
import { FinancialIntelligenceService } from './application/services/financial-intelligence.service';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';
import { CardController } from './presentation/controllers/card.controller';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { IncomeController } from './presentation/controllers/income.controller';
import { LoanController } from './presentation/controllers/loan.controller';
import { FinancingController } from './presentation/controllers/financing.controller';
import { DashboardController } from './presentation/controllers/dashboard.controller';

// Auth Strategies
import { GoogleStrategy } from './infrastructure/auth/strategies/google.strategy';
import { JwtStrategy } from './infrastructure/auth/strategies/jwt.strategy';

// Repository Tokens
const USER_REPOSITORY = 'IUserRepository';
const CARD_REPOSITORY = 'ICardRepository';
const TRANSACTION_REPOSITORY = 'ITransactionRepository';
const INCOME_REPOSITORY = 'IIncomeRepository';
const LOAN_REPOSITORY = 'ILoanRepository';
const FINANCING_REPOSITORY = 'IFinancingRepository';
const INSIGHT_REPOSITORY = 'IInsightRepository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const expiration = process.env.JWT_EXPIRATION || '7d';
        return {
          secret: process.env.JWT_SECRET || 'your-secret-key',
          signOptions: { 
            expiresIn: expiration,
          },
        } as any;
      },
    }),
  ],
  controllers: [
    AuthController,
    CardController,
    TransactionController,
    IncomeController,
    LoanController,
    FinancingController,
    DashboardController,
  ],
  providers: [
    PrismaService,
    GoogleStrategy,
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService, userRepository: UserRepository) => {
        return new JwtStrategy(configService, userRepository);
      },
      inject: [ConfigService, USER_REPOSITORY],
    },
    
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: CARD_REPOSITORY,
      useClass: CardRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
    {
      provide: INCOME_REPOSITORY,
      useClass: IncomeRepository,
    },
    {
      provide: LOAN_REPOSITORY,
      useClass: LoanRepository,
    },
    {
      provide: FINANCING_REPOSITORY,
      useClass: FinancingRepository,
    },
    {
      provide: INSIGHT_REPOSITORY,
      useClass: InsightRepository,
    },

    // Use Cases
    {
      provide: CreateCardUseCase,
      useFactory: (cardRepository: CardRepository) => new CreateCardUseCase(cardRepository),
      inject: [CARD_REPOSITORY],
    },
    {
      provide: GetUserCardsUseCase,
      useFactory: (cardRepository: CardRepository) => new GetUserCardsUseCase(cardRepository),
      inject: [CARD_REPOSITORY],
    },
    {
      provide: CreateTransactionUseCase,
      useFactory: (transactionRepository: TransactionRepository) => 
        new CreateTransactionUseCase(transactionRepository),
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: GetUserTransactionsUseCase,
      useFactory: (transactionRepository: TransactionRepository) => 
        new GetUserTransactionsUseCase(transactionRepository),
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: CreateIncomeUseCase,
      useFactory: (incomeRepository: IncomeRepository) => 
        new CreateIncomeUseCase(incomeRepository),
      inject: [INCOME_REPOSITORY],
    },
    {
      provide: CreateLoanUseCase,
      useFactory: (loanRepository: LoanRepository) => 
        new CreateLoanUseCase(loanRepository),
      inject: [LOAN_REPOSITORY],
    },
    {
      provide: CreateFinancingUseCase,
      useFactory: (financingRepository: FinancingRepository) => 
        new CreateFinancingUseCase(financingRepository),
      inject: [FINANCING_REPOSITORY],
    },

    // Services
    {
      provide: FinancialIntelligenceService,
      useFactory: (
        transactionRepository: TransactionRepository,
        incomeRepository: IncomeRepository,
        loanRepository: LoanRepository,
        financingRepository: FinancingRepository,
        insightRepository: InsightRepository,
      ) => new FinancialIntelligenceService(
        transactionRepository,
        incomeRepository,
        loanRepository,
        financingRepository,
        insightRepository,
      ),
      inject: [TRANSACTION_REPOSITORY, INCOME_REPOSITORY, LOAN_REPOSITORY, FINANCING_REPOSITORY, INSIGHT_REPOSITORY],
    },
  ],
})
export class AppModule {}
