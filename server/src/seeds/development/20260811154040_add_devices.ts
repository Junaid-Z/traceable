import { DEVICE_TYPE } from "@features/device/device.constants.js";
import { DeviceTable } from "@features/device/device.table.js";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex(DeviceTable.default.name)
    .insert([
      {
        [DeviceTable.default.columns.deviceNumber.name]: "1234567890",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeA,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "12324567890",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeB,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "123245672890",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeA,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "000000000000",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeA,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "000000000001",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeB,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000001",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "000000000002",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeA,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000000",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "000000000003",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeB,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000001",
      },
      {
        [DeviceTable.default.columns.deviceNumber.name]: "000000000004",
        [DeviceTable.default.columns.deviceType.name]: DEVICE_TYPE.TypeA,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]:
          "00000000-0000-0000-0000-000000000000",
      },
    ])
    .onConflict()
    .ignore();
}
