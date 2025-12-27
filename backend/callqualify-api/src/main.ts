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

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n🚀 CallQualify API running on: http://localhost:${port}/api`);
  console.log(`📚 Test endpoints:`);
  console.log(`   POST http://localhost:${port}/api/auth/register`);
  console.log(`   POST http://localhost:${port}/api/auth/login`);
  console.log(`   GET  http://localhost:${port}/api/auth/me\n`);
}
bootstrap();
