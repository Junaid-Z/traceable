import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("device_user", function (table) {
    table.uuid("user").notNullable();
    table.string("device", 30).notNullable();

    table.primary(["user", "device"], {
      constraintName: "pk_device_user",
    });
    table.unique("device", {
      indexName: "uq_device_user__device",
    });
    table
      .foreign("device", "fk_device_user__device")
      .references("device.device_number");
    table.foreign("user", "fk_device_user__user").references("user.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
