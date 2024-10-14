import {Request, Response, NextFunction} from 'express';
import ApiError from '../lib/ApiError';

const errorHandler = (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
	res.status(error.statusCode).json({status: error.statusCode, success: false, message: error.message});
}

export default errorHandler;
