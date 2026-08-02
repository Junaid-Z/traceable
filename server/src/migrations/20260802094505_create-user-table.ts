import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", function (table) {
    table.uuid("id", { primaryKey: true }).notNullable();
    table.string("username", 30).notNullable();
    table.string("display_name", 30).notNullable();
    table.string("password", 60).notNullable();
    table.string("nic", 13).notNullable();
    table.string("role", 20).notNullable();
    table.integer("salary").notNullable();
    table.string("contact", 12).notNullable();
    table.string("address", 255).notNullable();
    table.boolean("active").defaultTo(true).notNullable();

    table.unique("username", {
      indexName: "uq_user__user_name",
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
