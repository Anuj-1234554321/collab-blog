// import * as dotenv from 'dotenv';
// import { registerAs } from '@nestjs/config';

// dotenv.config();

// export default registerAs('env', () => ({
//   NODE_ENV: process.env.NODE_ENV,
//   PORT: process.env.PORT ? parseInt(process.env.PORT, 10):3000,

//   // Database Configuration
//   DB_HOST: process.env.DB_HOST, 
//   DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
//   DB_USERNAME: process.env.DB_USERNAME ,
//   DB_PASS: process.env.DB_PASS ,
//   DB_NAME: process.env.DB_NAME, 

//   // JWT Configuration
//   JWT_SECRET: process.env.JWT_SECRET || 'secret',
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

//   //nodemailer Configuration
//   MAIL_USERNAME: process.env.MAIL_USERNAME,
//   MAIL_PASSWORD: process.env.MAIL_PASSWORD,
//   // Redis uptash username and token
//   REDIS_URL: process.env.REDIS_URL,

//   // Firebase otp varification
//   projectIdD: process.env.PROJECT_ID,
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MESUREMENT_ID,
  
//   // firebase auth secret credentials
//   FIREBASE_TYPE :process.env.FIREBASE_TYPE,
//   FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
//   FIREBASE_CLIENT_ID : process.env.FIREBASE_CLIENT_ID,
//   FIREBASE_AUTH_URI: process.env.FIREBASE_AUTH_URI,
//   FIREBASE_TOKEN_URI: process.env.FIREBASE_TOKEN_URI,
//   FIREBASE_AUTH_PROVIDER_CERT_URL : process.env.FIREBASE_AUTH_PROVIDER_CERL_URL,
//   FIREBASE_CLIENT_CERT_URL: process.env.FIREBASE_CLIENT_CERT_URL,
//   FIREBASE_PRIVATE_KEY : process.env.FIREBASE_PRIVATE_KEY

// }));
// import * as dotenv from 'dotenv';
// import { registerAs } from '@nestjs/config';

// dotenv.config();

// export default registerAs('env', () => ({
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,

//   // Database Configuration
//   database: {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASS,
//     name: process.env.DB_NAME,
//   },

//   // JWT Configuration
//   jwt: {
//     secret: process.env.JWT_SECRET || 'secret',
//     expiresIn: process.env.JWT_EXPIRES_IN || '1h',
//   },

//   // Nodemailer Configuration
//   mail: {
//     username: process.env.MAIL_USERNAME,
//     password: process.env.MAIL_PASSWORD,
//   },

//   // Redis Configuration
//   redis: {
//     url: process.env.REDIS_URL,
//   },

//   // Firebase OTP Verification
//   firebase: {
//     projectId: process.env.PROJECT_ID,
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID,

//     // Firebase Service Account
//     serviceAccount: {
//       type: process.env.FIREBASE_TYPE,
//       project_id: process.env.PROJECT_ID,
//       private_key: process.env.FIREBASE_PRIVATE_KEY
//         ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Fix private key formatting
//         : undefined,
//       client_email: process.env.FIREBASE_CLIENT_EMAIL,
//       client_id: process.env.FIREBASE_CLIENT_ID,
//       auth_uri: process.env.FIREBASE_AUTH_URI,
//       token_uri: process.env.FIREBASE_TOKEN_URI,
//       auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
//       client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
//     },
//   },
// }));
import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config();

// // Utility function to format Firebase private key properly
// const getFirebasePrivateKey = (): string | undefined => {
//   const privateKey = process.env.private_key;
//   return privateKey ? privateKey.replace(/\\n/g, '\n') : undefined;
// };

export default registerAs('env', () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASS || 'password',
    name: process.env.DB_NAME || 'database',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

  // Nodemailer Configuration
  mail: {
    username: process.env.MAIL_USERNAME || '',
    password: process.env.MAIL_PASSWORD || '',
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || '',
  },

  // // Firebase OTP Verification
  // firebase: {
  //   apiKey: process.env.apiKey,
  //   authDomain: process.env.authDomain ,
  //   storageBucket: process.env.storageBucket,
  //   messagingSenderId: process.env.messagingSenderId ,
  //   appId: process.env.appId,
  //   measurementId: process.env.measurementId,
  //   // Firebase Service Account Configuration
  //   serviceAccount: {
  //     type: process.env.type,
  //     project_id: process.env.project_id || "netflix-gpt-fcdc8",
  //     private_key_id:process.env.private_key_id,
  //     private_key: getFirebasePrivateKey,
  //     client_email: process.env.client_email,
  //     client_id: process.env.client_id ,
  //     auth_uri: process.env.auth_uri ,
  //     token_uri: process.env.token_uri,
  //     auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  //     client_x509_cert_url: process.env.client_x509_cert_url,
  //     universe_domain:process.env.universe_domain
      

  //   },
  // },
}));

