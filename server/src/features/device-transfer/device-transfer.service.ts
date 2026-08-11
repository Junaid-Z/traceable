import { DeviceUserTable } from "@features/device-user/device-user.table.js";
import { DeviceTable } from "@features/device/device.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import { generateRandomPublicId } from "@shared/utils/id.utils.js";
import { randomUUID } from "crypto";
import type { Knex } from "knex";
import {
  DeviceTransferCreateDeviceAlreadyPendingTransferError,
  DeviceTransferCreateDeviceNotFoundError,
} from "./device-transfer.lib.js";
import { DeviceTransferTable } from "./device-transfer.table.js";

export type DeviceTransferCreateParams = {
  deviceNumber: string;
  fromUser: string;
  toUser: string;
};

export async function deviceTransferCreate(
  params: DeviceTransferCreateParams,
  trx?: Knex.Transaction,
) {
  const { deviceNumber, fromUser, toUser } = params;
  const client =
    trx ??
    (await connection.transaction(null, { doNotRejectOnRollback: true }));
  try {
    const foundDevice = await client(DeviceUserTable.default.name)
      .select(
        DeviceUserTable.default.columns.device,
        DeviceUserTable.default.columns.user,
      )
      .where({
        [DeviceUserTable.default.columns.device.name]: deviceNumber,
        [DeviceUserTable.default.columns.user.name]: fromUser,
      })
      .first();
    if (!foundDevice) {
      throw new DeviceTransferCreateDeviceNotFoundError(
        `Device not found in user (id=${fromUser})'s store`,
      );
    }

    const updateCount = await client(DeviceTable.default.name)
      .update({
        [DeviceTable.default.columns.isTransferring.name]: true,
      })
      .where({
        [DeviceTable.default.columns.deviceNumber.name]: deviceNumber,
        [DeviceTable.default.columns.isTransferring.name]: false,
      });
    if (updateCount === 0) {
      throw new DeviceTransferCreateDeviceAlreadyPendingTransferError();
    }

    const id = generateRandomPublicId();
    await client(DeviceTransferTable.default.name).insert({
      [DeviceTransferTable.default.columns.id.name]: randomUUID(),
      [DeviceTransferTable.default.columns.publicId.name]: id,
      [DeviceTransferTable.default.columns.deviceNumber.name]: deviceNumber,
      [DeviceTransferTable.default.columns.fromUser.name]: fromUser,
      [DeviceTransferTable.default.columns.toUser.name]: toUser,
      [DeviceTransferTable.default.columns.completedAt.name]: null,
    });
    if (!trx) await client.commit();

    return id;
  } catch (e) {
    if (!trx) await client.rollback();
    throw e;
  }
}
