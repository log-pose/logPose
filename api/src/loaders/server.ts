import logRequest from '../middleware/logRequest';
import errorHandler from '../middleware/errorHandler';
import * as  bodyParser from 'body-parser';
import  cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import routes from '../routes/routes'

export default (app: express.Application) => {
    app.enable('trust proxy');
    app.use(cors(
        {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        }
    ));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(logRequest)
    app.use('/api', routes);
    app.use(errorHandler)
};
