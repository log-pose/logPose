import { Request, Response, NextFunction } from "express";
import logger from "@logpose/logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  logger.info(`Request: ${req.method} ${req.originalUrl}`);
  logger.debug("Request Headers:", req.headers);
  logger.debug("Request Query:", req.query);
  logger.debug("Request Body:", req.body);

  res.on("finish", () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    logger.info(`Response: ${res.statusCode} ${res.statusMessage}`);
    logger.debug(`Request took ${duration}ms to process`);
  });
  next();
};

export default loggerMiddleware;
