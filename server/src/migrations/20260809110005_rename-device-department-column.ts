import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("device", function (table) {
    table.renameColumn("device_department", "device_type");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
