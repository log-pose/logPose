export default {
    port: parseInt(process.env.PORT as string) || 3000,
    jwtSecret: process.env.JWT_SECRET || "secret",
    service: "log-pose",
    rootDir: process.env.ROOT_DIR,
    debugLevel: process.env.DEBUG_LEVEL,
    hashSecret: process.env.HASH_SECRET || "15c2e772",
    hashAlg: process.env.HASH_ALG || "aes256",
    database: {
        host: process.env.PSQL_HOST,
        password: process.env.PSQL_PASSWORD,
        db: process.env.PSQL_DB,
        port: parseInt(process.env.PSQL_PORT as string),
        user: process.env.PSQL_USER
    }
};