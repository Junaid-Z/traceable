import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("device", function (table) {
    table.string("device_number", 30);
    table.string("device_department", 10);
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
