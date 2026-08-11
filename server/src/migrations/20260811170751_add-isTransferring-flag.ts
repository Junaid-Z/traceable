import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("device", function (table) {
    table.boolean("is_transferring").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
