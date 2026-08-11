import { DeviceUserTable } from "@features/device-user/device-user.table.js";
import { DeviceTable } from "@features/device/device.table.js";
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

  await knex(DeviceTable.default.name)
    .update({
      [DeviceTable.default.columns.isTransferring.name]: true,
    })
    .whereIn(DeviceTable.default.columns.deviceNumber.name, [
      "000000000000",
      "000000000001",
      "000000000002",
      "000000000003",
      "000000000004",
    ]);
}
