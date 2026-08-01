import knex from "knex";
import { knexConfig } from "../config/knex.config.js";

export const connection = knex(knexConfig);
