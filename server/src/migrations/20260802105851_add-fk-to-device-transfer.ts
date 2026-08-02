import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("device_transfer", function (table) {
    table
      .foreign("device_number", "fk_device_transfer__device_number__device")
      .references("device.device_number");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
