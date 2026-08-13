import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("device", function (table) {
    table.uuid("store").nullable();
  });
  await knex(knex.raw("device(device_number,store)"))
    .insert(
      knex("device_user").select({
        device_number: "device",
        store: "user",
      }),
    )
    .onConflict(["device_number"])
    .merge(["store"]);
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("🚫 Migration rollback not allowed.");
}
