import { USER_ROLE } from "@features/user/user.constants.js";
import { UserTable } from "@features/user/user.table.js";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex(UserTable.default.name)
    .insert([
      {
        [UserTable.default.columns.id.name]:
          "00000000-0000-0000-0000-000000000000",
        [UserTable.default.columns.displayName.name]: "Junaid Zafar",
        [UserTable.default.columns.username.name]: "junaid-z",
        [UserTable.default.columns.password.name]:
          "$2a$12$JtvNlDmjT.f0hot5AKfY3uYvDSph.M5lwo2HfvfmI.dLg.m28s/fO", //hash for password123
        [UserTable.default.columns.nic.name]: "4200012345678",
        [UserTable.default.columns.contact.name]: "923091234567",
        [UserTable.default.columns.role.name]: USER_ROLE.SUPER_USER,
        [UserTable.default.columns.salary.name]: 200_000,
        [UserTable.default.columns.address.name]:
          "street 123, some address, some city",
        [UserTable.default.columns.active.name]: true,
      },
      {
        [UserTable.default.columns.id.name]:
          "00000000-0000-0000-0000-000000000001",
        [UserTable.default.columns.displayName.name]: "Ahmed",
        [UserTable.default.columns.username.name]: "ahmed",
        [UserTable.default.columns.password.name]:
          "$2a$12$JtvNlDmjT.f0hot5AKfY3uYvDSph.M5lwo2HfvfmI.dLg.m28s/fO", //hash for password123
        [UserTable.default.columns.nic.name]: "4200012345679",
        [UserTable.default.columns.contact.name]: "923091234568",
        [UserTable.default.columns.role.name]: USER_ROLE.ADMIN,
        [UserTable.default.columns.salary.name]: 150_000,
        [UserTable.default.columns.address.name]:
          "street 456, some address, some city",
        [UserTable.default.columns.active.name]: true,
      },
    ])
    .onConflict([UserTable.default.columns.id.name])
    .ignore();
}
