import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Load environment variables

export const connectionSource = new DataSource({
  type:'postgres',
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../modules/**/*.entity.{ts,js}']

});

export default connectionSource;