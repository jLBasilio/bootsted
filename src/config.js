import dotenv from 'dotenv';
dotenv.config();

const { env } = process;

export const {
  MEME,
  PORT,
  SLACK_PREFIX,
  SLACK_TOKEN
} = env;

export const MEMETYPES = {
  DANK: env.DANK.split(','),
  GAMING: env.GAMING.split(','),
  NORMIE: env.NORMIE.split(','),
  SAD: env.SAD.split(','),
  TECH: env.TECH.split(','),
  WHOLESOME: env.WHOLESOME.split(','),
  WTF: env.WTF.split(','),
}
