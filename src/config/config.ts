import * as dotenv from 'dotenv';
import path from 'path';
import config from 'config';
import { NODE_ENV_VAL } from '../common/constants/constants';

const nodeENV: string = NODE_ENV_VAL.DEVELOPMENT;
// const nodeENV: string = NODE_ENV_VAL.TEST;
// const nodeENV: string = NODE_ENV_VAL.PRODUCTION;

dotenv.config({
  path: path.resolve(
    __dirname,
    `../../.env.${process.env.NODE_ENV ?? nodeENV}`,
  ),
});

interface Config {
  port: number;
  nodeEnv: string;
  baseUrl: string;
  hostname: string;
  database_Url: string;
  jwksUri: string;
}

export const configENV: Config = {
  port: config.get('server.port') || 5003,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: config.get('server.baseUrl') ?? '/pizza-app/catalog-service/api/v1',
  hostname: config.get('server.hostname') ?? 'localhost',
  database_Url: config.get('database.url') || '',
  jwksUri: config.get('auth.jwksUri') || '',
};
