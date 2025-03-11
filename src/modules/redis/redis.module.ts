import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // Makes RedisService available across the app
@Module({
  providers: [RedisService],
  exports: [RedisService], // Allows other modules to use it
})
export class RedisModule {}
