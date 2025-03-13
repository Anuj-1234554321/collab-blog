import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './modules/auth/gaurds/roles.guard';
import { JwtAuthGuard } from './modules/auth/gaurds/jwt-auth.guard';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS if needed
   
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()), new RolesGuard(new Reflector()));


  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ||3001;
  const HOST = configService.get<string>('LOCAL_IP') || '0.0.0.0'; // Default to all network interfaces

  await app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}

bootstrap();
