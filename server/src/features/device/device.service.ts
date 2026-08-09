import { DeviceUserTable } from "@features/device-user/device-user.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import type { Knex } from "knex";
import type { DeviceType } from "./device.constants.js";
import { DeviceTable } from "./device.table.js";

export type DeviceCreateParams = {
  deviceNumber: string;
  deviceType: DeviceType;
  store: string;
};

export async function deviceCreate(
  params: DeviceCreateParams,
  trx?: Knex.Transaction,
) {
  const { deviceNumber, deviceType, store } = params;
  const client =
    trx ??
    (await connection.transaction(null, { doNotRejectOnRollback: true }));
  try {
    await client(DeviceTable.default.name).insert({
      [DeviceTable.default.columns.deviceNumber.name]: deviceNumber,
      [DeviceTable.default.columns.deviceType.name]: deviceType,
    });
    await client(DeviceUserTable.default.name).insert({
      [DeviceUserTable.default.columns.device.name]: deviceNumber,
      [DeviceUserTable.default.columns.user.name]: store,
    });
    if (!trx) await client.commit();
  } catch (e) {
    if (!trx) await client.rollback();
    throw e;
  }
}
