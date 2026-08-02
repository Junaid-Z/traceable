import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE device_transfer 
    RENAME CONSTRAINT device_transfer_pkey TO pk_device_transfer;
  `);
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
