import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("device_transfer", function (table) {
    table.string("stage", 10).nullable();
  });

  await knex.raw(`UPDATE device_transfer SET stage = CASE 
    WHEN device_transfer.completed_at is null THEN 'pending'
    ELSE 'completed'
    END`);

  await knex.schema.alterTable("device_transfer", function (table) {
    table.dropNullable("stage");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
