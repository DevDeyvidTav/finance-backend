import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3001;
  
  // Para produção na Vercel, não precisa especificar a porta
  if (process.env.NODE_ENV === 'production') {
    await app.init();
    console.log(`🚀 Application initialized for production`);
  } else {
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
  }
}

bootstrap();

// Export for Vercel
export default bootstrap;
