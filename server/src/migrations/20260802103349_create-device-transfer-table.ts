import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("device_transfer", function (table) {
    table.uuid("id", { primaryKey: true }).notNullable();
    table.string("public_id", 11).notNullable();
    table.string("device_number", 30).notNullable();
    table.uuid("to_user").notNullable();
    table.uuid("from_user").notNullable();
    table.dateTime("completed_at", { useTz: true }).nullable();

    table
      .foreign("to_user", "fk_device_transfer__to_user__user")
      .references("user.id");
    table
      .foreign("from_user", "fk_device_transfer__from_user__user")
      .references("user.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
