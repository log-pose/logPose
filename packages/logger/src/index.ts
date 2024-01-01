import { createLogger, format, transports, Logger } from "winston";
const { combine, timestamp, label, printf, json } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const devLogger = (serviceName: string): Logger => {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: serviceName }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    transports: [new transports.Console()],
  });
};

const debugLogger = (serviceName: string, logDir: string): Logger => {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: serviceName }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: `${logDir}/${serviceName}/debug.log`,
        level: "debug",
      }),
    ],
  });
};

const prodLogger = (serviceName: string, logDir: string): Logger => {
  return createLogger({
    format: combine(label({ label: serviceName }), timestamp(), json()),
    transports: [
      new transports.File({
        filename: `${logDir}/error.log`,
        level: "error",
      }),
    ],
  });
};

const SERVICE_NAME = "LOGPOSE";
const ROOT_DIR = process.env.ROOT_DIR as string;
const LOG_DIR = `${ROOT_DIR}/logs`;

let logger = devLogger(SERVICE_NAME);

let DEBUG_LEVEL = process.env.DEBUG_LEVEL;

if (DEBUG_LEVEL === "DEBUG") {
  logger = debugLogger(SERVICE_NAME, LOG_DIR);
} else if (DEBUG_LEVEL === "PROD") {
  logger = prodLogger(SERVICE_NAME, LOG_DIR);
}

export default logger;
