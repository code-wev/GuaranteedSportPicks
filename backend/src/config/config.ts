import dotenv from 'dotenv';

dotenv.config();

interface Config {
  BASE_URL: string;
  PORT: number;
  DB_CONNECTION_URI: string;
  NODE_ENV: string;
  SALT_ROUNDS: number;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: number;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  MAX_JSON_SIZE: string;
  MAX_FILE_SIZE: number;
  URL_ENCODED: boolean;
  REQUEST_LIMIT_TIME: number;
  REQUEST_LIMIT_NUMBER: number;
  WEB_CACHE: boolean;
  EXPRESS_FILE_UPLOAD_CONFIG: object;
  EMAIL_VERIFICATION_REDIRECT_URI: string;
  PASSWORD_RESET_REDIRECT_URI: string;
  STRIPE_SECRET_KEY: string;
  WEBHOOK_KEY: string;
  FRONTEND_URL: string;
  MONTHLY_PRICE_ID: string;
  WEEKLY_PRICE_ID: string;
  DAILY_PRICE_ID: string;
  IMGBB_API_KEY: string;
  AFFILIATE_COMMISSION_RATE: number;
}

const config: Config = {
  BASE_URL: process.env.BASE_URL as string,
  PORT: parseInt(process.env.PORT as string, 10),
  DB_CONNECTION_URI: process.env.DB_CONNECTION_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS as string, 10),
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRATION_TIME: parseInt(process.env.JWT_EXPIRATION_TIME as string, 10),
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT as string, 10),
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  MAX_JSON_SIZE: process.env.MAX_JSON_SIZE as string,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE as string, 10),
  URL_ENCODED: process.env.URL_ENCODED === 'true' ? true : false,
  REQUEST_LIMIT_TIME: parseInt(process.env.REQUEST_LIMIT_TIME as string, 10),
  REQUEST_LIMIT_NUMBER: parseInt(process.env.REQUEST_LIMIT_NUMBER as string, 10),
  WEB_CACHE: process.env.WEB_CACHE === 'true' ? true : false,
  EXPRESS_FILE_UPLOAD_CONFIG: {
    createParentPath: true,
    preserveExtension: true,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE as string, 10),
    },
  },
  EMAIL_VERIFICATION_REDIRECT_URI: process.env.EMAIL_VERIFICATION_REDIRECT_URI as string,
  PASSWORD_RESET_REDIRECT_URI: process.env.PASSWORD_RESET_REDIRECT_URI as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  WEBHOOK_KEY: process.env.WEBHOOK_KEY as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  DAILY_PRICE_ID: process.env.DAILY_PRICE_ID as string,
  WEEKLY_PRICE_ID: process.env.WEEKLY_PRICE_ID as string,
  MONTHLY_PRICE_ID: process.env.MONTHLY_PRICE_ID as string,
  IMGBB_API_KEY: process.env.IMGBB_API_KEY as string,
  AFFILIATE_COMMISSION_RATE: parseFloat(process.env.AFFILIATE_COMMISSION_RATE as string) || 2,
};

export default config;
