import logger from "../lib/logger";
import {Request, Response, NextFunction} from "express";

const logRequest = (req: Request, _res: Response, next: NextFunction) => {
	logger.info(`Request Type: ${req.method}`);
	logger.info(`Path: ${req.originalUrl}`);
	next();
}

export default logRequest

