import {db} from "../loaders/psql";
import {migrate} from "drizzle-orm/postgres-js/migrator";

async function main() {
    await migrate(db, {migrationsFolder: "migrations"});
}

main().catch((err) => {
    console.error(err);
});
