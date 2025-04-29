import dotenv from 'dotenv';

dotenv.config();

const {
  ENV_WHITE_USER_IDS,
  ENV_DEVICE_NAMES,
  ENV_POLICY_NAME,
  ENV_TELEGRAM_BOT_TOKEN,
  ENV_HOST,
  ENV_USERNAME,
  ENV_PASSWORD,
} = process.env;

if (!ENV_WHITE_USER_IDS) {
  throw new Error('empty ENV_WHITE_USER_IDS')
}
if (!ENV_DEVICE_NAMES) {
  throw new Error('empty ENV_DEVICE_NAMES')
}
if (!ENV_TELEGRAM_BOT_TOKEN) {
  throw new Error('empty ENV_TELEGRAM_BOT_TOKEN')
}
if (!ENV_HOST) {
  throw new Error('empty ENV_HOST')
}
if (!ENV_USERNAME) {
  throw new Error('empty ENV_USERNAME')
}
if (!ENV_PASSWORD) {
  throw new Error('empty ENV_PASSWORD')
}

const DEFAULT_ENV_POLICY_NAME = 'Policy0';

export const WHITE_USER_IDS_LIST = new Set(ENV_WHITE_USER_IDS?.split(','))
export const DEVICE_NAMES_LIST = new Set(ENV_DEVICE_NAMES?.split(','));
export const POLICY_NAME = ENV_POLICY_NAME ?? DEFAULT_ENV_POLICY_NAME;
export const TELEGRAM_BOT_TOKEN = ENV_TELEGRAM_BOT_TOKEN;
export const HOST = ENV_HOST;
export const USERNAME = ENV_USERNAME;
export const PASSWORD = ENV_PASSWORD;
