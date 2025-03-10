import { Module, Global } from '@nestjs/common';
import { RedisService } from '../../services/redis/redis.service';

@Global() // Makes RedisService available across the app
@Module({
  providers: [RedisService],
  exports: [RedisService], // Allows other modules to use it
})
export class RedisModule {}
