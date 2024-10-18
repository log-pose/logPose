import config from "./config/env"
import * as express from 'express';
import loaders from './loaders';
import logger from './lib/logger';



async function main() {
    const app = express.default();
    await loaders(app);
    app.listen(config.port, () => {
        logger.info(`Server is listening on port ${config.port}`);
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received.');
        logger.info('Express app closed.');
        process.exit(0);
    });
}

main();
