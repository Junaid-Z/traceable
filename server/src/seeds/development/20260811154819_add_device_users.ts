import { DeviceUserTable } from "@features/device-user/device-user.table.js";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex(DeviceUserTable.default.name)
    .insert([
      {
        [DeviceUserTable.default.columns.device.name]: "000000000000",
        [DeviceUserTable.default.columns.user.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceUserTable.default.columns.device.name]: "000000000001",
        [DeviceUserTable.default.columns.user.name]:
          "00000000-0000-0000-0000-000000000001",
      },
      {
        [DeviceUserTable.default.columns.device.name]: "000000000002",
        [DeviceUserTable.default.columns.user.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceUserTable.default.columns.device.name]: "000000000003",
        [DeviceUserTable.default.columns.user.name]:
          "00000000-0000-0000-0000-000000000001",
      },
      {
        [DeviceUserTable.default.columns.device.name]: "000000000004",
        [DeviceUserTable.default.columns.user.name]:
          "00000000-0000-0000-0000-000000000000",
      },
    ])
    .onConflict()
    .ignore();
}
