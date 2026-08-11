import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("device_transfer", function (table) {
    table.unique("public_id", {
      indexName: "uq_public_id",
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
