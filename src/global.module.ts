// import { Module, Global } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './modules/auth/auth.module';
// import registerAs  from '../config/env.config';

// @Global()
// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }), // ✅ Load environment variables
//     TypeOrmModule.forRoot(databaseConfig), // ✅ Use proper DB config
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'default_secret',
//       signOptions: { expiresIn: '1h' },
//     }),
//     AuthModule, // ✅ Import AuthModule before exporting it
//   ],
//   exports: [ConfigModule, TypeOrmModule, JwtModule, AuthModule], // ✅ Correct exports
// })
// export class GlobalModule {}
import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { connectionSource } from 'config/ormconfig';
import { FollowersModule } from './modules/followers/followers.module';
import { RedisModule } from './modules/redis/redis.module';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Load env variables globally
    TypeOrmModule.forRoot({...connectionSource.options,
      autoLoadEntities: true, 
    }),  // ✅ Database connection
    AuthModule, // ✅ Include AuthModule
    UsersModule, // ✅ Include UsersModule
    FollowersModule,
    RedisModule
  ],
  exports: [
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    UsersModule, // ✅ Export all modules so they are accessible everywhere
    FollowersModule,
    RedisModule, // ✅ Export RedisModule so it can be used in other modules
  ],
})
export class GlobalModule {}


