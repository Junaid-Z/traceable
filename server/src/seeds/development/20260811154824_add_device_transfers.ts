import { DeviceTransferTable } from "@features/device-transfer/device-transfer.table.js";
import { DeviceTable } from "@features/device/device.table.js";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex(DeviceTransferTable.default.name)
    .insert([
      {
        id: "00000000-0000-0000-0000-000000000000",
        public_id: "00000000",
        device_number: "000000000000",
        from_user: "00000000-0000-0000-0000-000000000000",
        to_user: "00000000-0000-0000-0000-000000000001",
        stage: "completed",
      },
      {
        id: "00000000-0000-0000-0000-000000000001",
        public_id: "00000001",
        device_number: "000000000001",
        from_user: "00000000-0000-0000-0000-000000000001",
        to_user: "00000000-0000-0000-0000-000000000000",
        stage: "pending",
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        public_id: "00000002",
        device_number: "000000000002",
        from_user: "00000000-0000-0000-0000-000000000000",
        to_user: "00000000-0000-0000-0000-000000000001",
        stage: "completed",
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
    ]);
}
