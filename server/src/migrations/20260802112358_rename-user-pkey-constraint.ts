import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE public.user 
    RENAME CONSTRAINT user_pkey TO pk_user;
  `);
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
