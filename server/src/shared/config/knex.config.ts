import type { Knex } from "knex";
import { resolve } from "path";
import { env } from "./env.config.js";

export const knexConfig: Knex.Config = {
  client: "pg",
  connection: {
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
  pool: { min: 2, max: 15 },
  migrations: {
    tableName: "knex_migrations",
    directory: resolve(import.meta.dirname, "../../migrations"),
    extension: "ts",
  },
};

export default knexConfig;
