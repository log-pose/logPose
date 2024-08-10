import {defineConfig} from "drizzle-kit"

const PSQL_USER = process.env.PSQL_USER as string;
const PSQL_PASSWORD = process.env.PSQL_PASSWORD as string;
const PSQL_HOST = process.env.PSQL_HOST as string;
const PSQL_PORT = process.env.PSQL_PORT as string;
const PSQL_DATABASE = process.env.PSQL_DATABASE as string;

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: `postgresql://${PSQL_USER}:${PSQL_PASSWORD}@${PSQL_HOST}:${PSQL_PORT}/${PSQL_DATABASE}`
	},
	schema: "./src/schema.ts"
})
