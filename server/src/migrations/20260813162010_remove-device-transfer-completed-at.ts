import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("device_transfer", function (table) {
    table.dropColumn("completed_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
