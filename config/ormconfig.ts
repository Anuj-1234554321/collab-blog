// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { config } from 'dotenv';

// config(); // Load environment variables

// export const databaseConfig: TypeOrmModuleOptions = {
//   type: 'postgres', // Change to 'mysql' if needed
//   host: process.env.DB_HOST || 'localhost',
//   port:  process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'Anuj@12345',
//   database: process.env.DB_NAME || 'database_development',
//   entities: ['dist/**/*.entity.js'], // Include all entities
//   synchronize: false, // Set to false in production
//   migrations: ['dist/migrations/*.js'],
// };

// import { DataSourceOptions } from 'typeorm';
// import { config } from 'dotenv';

// config(); // Load environment variables

// export const databaseConfig: TypeOrmModuleOptions = {
//   type: 'postgres', // or 'mysql', 'sqlite', etc.
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_NAME || 'collab_blog',
//   entities: ['dist/**/*.entity.js'], // Load all entities
//   synchronize: false, // Use migrations instead of auto-sync
// };

// import { DataSourceOptions } from 'typeorm';
// import { config } from 'dotenv';

// config(); // Load environment variables

// export const databaseConfig: DataSourceOptions = {
//   type: 'postgres', // Ensure the database type is set
//   host: process.env.DB_HOST ,
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME ,
//   password: process.env.DB_PASSWORD ,
//   database: process.env.DB_NAME ,
//   entities: ['dist/**/*.entity.js'], // Ensure this matches your build path
//   migrations: ['dist/database/migrations/*.js'], // Ensure migration path is correct
//   migrationsTableName: 'migrations',
//   synchronize: false, // Set false when using migrations
//   logging: true, // Enable logging for debugging
//   ssl: process.env.DB_SSL === 'true', // Optional: Enable SSL if needed
// };

import { DataSource } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity'; // Import your entities
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
