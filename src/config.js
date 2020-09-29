import dotenv from 'dotenv';
dotenv.config();

export const {
  SLACK_TOKEN,
  SLACK_PREFIX,
  PORT,
} = process.env;
