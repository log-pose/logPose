import {drizzle} from "drizzle-orm/node-postgres";
import {Client} from "pg";
import config from "../config/env";

const client = new Client({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db
});

export default client
const db = drizzle(client)
export {db}
