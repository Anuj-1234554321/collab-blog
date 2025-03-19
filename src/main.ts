import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './modules/auth/gaurds/roles.guard';
import { JwtAuthGuard } from './modules/auth/gaurds/jwt-auth.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  // Explicitly define app as NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(); // Enable CORS if needed
  
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()), new RolesGuard(new Reflector()));

  // Corrected way to serve static assets
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/', // Optional: Set a URL prefix
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3001;
  const HOST = configService.get<string>('LOCAL_IP') || '0.0.0.0'; // Default to all network interfaces

  await app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}

bootstrap();
