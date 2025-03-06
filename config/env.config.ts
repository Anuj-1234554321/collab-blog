import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config();

export default registerAs('env', () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,

  // Database Configuration
  DB_HOST: process.env.DB_HOST, 
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  DB_USERNAME: process.env.DB_USERNAME ,
  DB_PASS: process.env.DB_PASS ,
  DB_NAME: process.env.DB_NAME, 

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
}));
