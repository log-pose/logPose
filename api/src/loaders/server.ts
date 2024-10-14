import logRequest from '../middleware/logRequest';
import errorHandler from '../middleware/errorHandler';
import * as  bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import routes from '../routes/routes'

export default (app: express.Application) => {
    app.enable('trust proxy');
    app.use(cors(
        {
            origin: 'http://localhost:5173', // Replace with your frontend URL
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
            credentials: true, // Enable to allow cookies and authentication tokens
        }
    ));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(logRequest)
    app.use('/api', routes);
    app.use(errorHandler)
};
