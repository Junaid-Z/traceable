import { DeviceTable } from "@features/device/device.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import { generateRandomPublicId } from "@shared/utils/id.utils.js";
import { randomUUID } from "crypto";
import type { Knex } from "knex";
import {
  DeviceTransferCreateDeviceNotFoundError,
  DeviceTransferCreateDeviceSenderSameAsReceiverError,
} from "./device-transfer.lib.js";
import { DEVICE_TRANSFER_STAGE } from "./device-transfer.schemas.js";
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
  if (fromUser === toUser) {
    throw new DeviceTransferCreateDeviceSenderSameAsReceiverError(
      `fromUser (${fromUser}) is same as toUser (${toUser})`,
    );
  }

  const client =
    trx ??
    (await connection.transaction(null, { doNotRejectOnRollback: true }));
  try {
    const updateCount = await client(DeviceTable.default.name)
      .update({
        [DeviceTable.default.columns.isTransferring.name]: true,
      })
      .where({
        [DeviceTable.default.columns.deviceNumber.name]: deviceNumber,
        [DeviceTable.default.columns.isTransferring.name]: false,
        [DeviceTable.default.columns.store.name]: fromUser,
      });
    if (updateCount === 0) {
      throw new DeviceTransferCreateDeviceNotFoundError();
    }

    const id = generateRandomPublicId();
    await client(DeviceTransferTable.default.name).insert({
      [DeviceTransferTable.default.columns.id.name]: randomUUID(),
      [DeviceTransferTable.default.columns.publicId.name]: id,
      [DeviceTransferTable.default.columns.deviceNumber.name]: deviceNumber,
      [DeviceTransferTable.default.columns.fromUser.name]: fromUser,
      [DeviceTransferTable.default.columns.toUser.name]: toUser,
      [DeviceTransferTable.default.columns.stage.name]:
        DEVICE_TRANSFER_STAGE.PENDING,
    });
    if (!trx) await client.commit();

    return id;
  } catch (e) {
    if (!trx) await client.rollback();
    throw e;
  }
}
