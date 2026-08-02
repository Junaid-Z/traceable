import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("device_transfer_history", function (table) {
    table.uuid("id").notNullable();
    table.uuid("transfer_id").notNullable();
    table.string("action", 30).notNullable();
    table.dateTime("timestamp").notNullable();

    table.primary(["id"], {
      constraintName: "pk_device_transfer_history",
    });
    table
      .foreign(
        "transfer_id",
        "fk_device_transfer_history__transfer_id__device_transfer",
      )
      .references("device_transfer.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
