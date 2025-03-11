import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config();

export default registerAs('env', () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10):3000,

  // Database Configuration
  DB_HOST: process.env.DB_HOST, 
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  DB_USERNAME: process.env.DB_USERNAME ,
  DB_PASS: process.env.DB_PASS ,
  DB_NAME: process.env.DB_NAME, 

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

  //twilio Configuration
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  //nodemailer Configuration
  // MAIL_HOST: process.env.MAIL_HOST,
  // MAIL_PORT: process.env.MAIL_PORT? parseInt(process.env.MAIL_PORT, 10) : 465,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  // Redis uptash username and token
  REDIS_URL: process.env.REDIS_URL,
}));
