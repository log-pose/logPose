import {defineConfig} from 'drizzle-kit'
import dotenv from "dotenv";
import path from "path"
dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});

export default defineConfig({
    dbCredentials: {
        url: `postgresql://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.PSQL_PORT}/${process.env.PSQL_DATABASE}`
    },
    schema: "./src/config/schema.ts",
    dialect: 'postgresql',
})
