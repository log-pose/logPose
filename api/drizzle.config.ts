import {defineConfig} from 'drizzle-kit'
import config from './src/config/env'

export default defineConfig({
    dbCredentials: {
        url: `postgresql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.db}`
    },
    schema: "./src/config/schema.ts",
    dialect: 'postgresql',
})
