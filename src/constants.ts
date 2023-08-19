import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

process.env.NODE_ENV ??= 'production';

export const LOG_LEVEL: pino.Level = (process.env.LOG_LEVEL as pino.Level) || 'info';

export const APP_NAME: string = process.env.npm_package_name || 'my_awesome_node_backed';

export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 9000;
