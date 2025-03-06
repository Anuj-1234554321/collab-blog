import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS if needed

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  const HOST = configService.get<string>('LOCAL_IP') || '0.0.0.0'; // Default to all network interfaces

  await app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}

bootstrap();
