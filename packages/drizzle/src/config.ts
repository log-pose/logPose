import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const PSQL_USER = process.env.PSQL_USER as string;
const PSQL_PASSWORD = process.env.PSQL_PASSWORD as string;
const PSQL_HOST = process.env.PSQL_HOST as string;
const PSQL_PORT = process.env.PSQL_PORT as string;
const PSQL_DATABASE = process.env.PSQL_DATABASE as string;

const pool = new Pool({
  host: PSQL_HOST,
  port: parseInt(PSQL_PORT),
  user: PSQL_USER,
  password: PSQL_PASSWORD,
  database: PSQL_DATABASE,
});
const psqlClient = drizzle(pool);

export default psqlClient;
