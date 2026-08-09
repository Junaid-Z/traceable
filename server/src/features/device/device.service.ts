import type { Knex } from "knex";
import type { DeviceType } from "./device.constants.js";
import { connection } from "@shared/lib/connection.lib.js";
import { DeviceTable } from "./device.table.js";

export type DeviceCreateParams = {
  deviceNumber: string;
  deviceType: DeviceType;
};

export async function deviceCreate(
  params: DeviceCreateParams,
  trx?: Knex.Transaction,
) {
  const { deviceNumber, deviceType } = params;
  connection.transaction(
    async (t) => {
      await t(DeviceTable.default.name).insert({
        [DeviceTable.default.columns.deviceNumber.name]: deviceNumber,
        [DeviceTable.default.columns.deviceType.name]: deviceType,
      });
    },
    { connection: trx },
  );
}
