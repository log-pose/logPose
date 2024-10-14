import {createLogger, format, transports, Logger} from "winston";
import config from "../config/env";
const {combine, timestamp, label, printf, json} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const devLogger = (serviceName: string): Logger => {
    return createLogger({
        level: "info",
        format: combine(
            label({label: serviceName}),
            timestamp({format: "HH:mm:ss"}),
            myFormat
        ),
        transports: [new transports.Console()],
    });
};

const debugLogger = (serviceName: string, logDir: string): Logger => {
    return createLogger({
        level: "info",
        format: combine(
            label({label: serviceName}),
            timestamp({format: "HH:mm:ss"}),
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
        format: combine(label({label: serviceName}), timestamp(), json()),
        transports: [
            new transports.File({
                filename: `${logDir}/error.log`,
                level: "error",
            }),
        ],
    });
};

const serviceName = config.service;
const logsDir = `${config.rootDir}/logs`;

let logger = devLogger(serviceName);

let debugLvl = config.debugLevel

if (debugLvl === "DEBUG") {
    logger = debugLogger(serviceName, logsDir);
} else if (debugLvl === "PROD") {
    logger = prodLogger(serviceName, logsDir);
}

export default logger;
