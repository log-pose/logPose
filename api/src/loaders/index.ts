import * as express from 'express';
import server from './server';
import client from './psql';
import logger from '../lib/logger';
export default async (app: express.Application) => {
    await client.connect()

    logger.info('Database loaded');
    server(app);
    logger.info('Server loaded');
};
