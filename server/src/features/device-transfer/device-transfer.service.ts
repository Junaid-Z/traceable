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
import { escapeSqlLike } from "@shared/utils/sql.utils.js";
import { deviceTransferSearchResultSchema } from "./device-transfer.schemas.js";

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
        DeviceUserTable.default.columns.device.name,
        DeviceUserTable.default.columns.user.name,
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

export type DeviceTransferSearchParams = {
  query?: {
    id?: string;
    publicId?: string;
    deviceNumber?: string;
    user?:
      | {
          fromUser?: string;
          toUser?: string;
        }
      | string;
  };
  meta?: {
    limit?: number;
    offset?: number;
    isComplete?: boolean;
    exactDeviceNumberMatch?: boolean;
  };
};

const deviceTransferSearchTable = new DeviceTransferTable({
  columns: {
    id: "id",
    publicId: "publicId",
    deviceNumber: "deviceNumber",
    fromUser: "fromUser",
    toUser: "toUser",
    completedAt: "completedAt",
  },
});

export async function deviceTransferSearch(
  params: DeviceTransferSearchParams,
  trx?: Knex.Transaction,
) {
  const { query = {}, meta = {} } = params;
  const { id, deviceNumber, user, publicId } = query;
  const { limit, offset, isComplete, exactDeviceNumberMatch } = meta;
  const client = trx ?? connection;

  const transfersQuery = client(DeviceTransferTable.default.name).select(
    deviceTransferSearchTable.columns.id.aliasedRef,
    deviceTransferSearchTable.columns.publicId.aliasedRef,
    deviceTransferSearchTable.columns.deviceNumber.aliasedRef,
    deviceTransferSearchTable.columns.fromUser.aliasedRef,
    deviceTransferSearchTable.columns.toUser.aliasedRef,
    deviceTransferSearchTable.columns.completedAt.aliasedRef,
  );

  if (id) {
    transfersQuery.where({
      [deviceTransferSearchTable.columns.id.name]: id,
    });
  }
  if (publicId) {
    transfersQuery.where({
      [deviceTransferSearchTable.columns.publicId.name]: publicId,
    });
  }

  if (typeof user === "string") {
    transfersQuery.where(function (query) {
      query.where({
        [deviceTransferSearchTable.columns.fromUser.name]: user,
      });

      query.orWhere({
        [deviceTransferSearchTable.columns.toUser.name]: user,
      });
    });
  }
  if (typeof user === "object" && user.fromUser) {
    transfersQuery.where({
      [deviceTransferSearchTable.columns.fromUser.name]: user.fromUser,
    });
  }
  if (typeof user === "object" && user.toUser) {
    transfersQuery.where({
      [deviceTransferSearchTable.columns.toUser.name]: user.toUser,
    });
  }

  if (deviceNumber !== undefined && deviceNumber && !exactDeviceNumberMatch) {
    transfersQuery.whereLike(
      DeviceTransferTable.default.columns.deviceNumber.name,
      escapeSqlLike(deviceNumber) + "%",
    );
  }
  if (deviceNumber !== undefined && deviceNumber && exactDeviceNumberMatch) {
    transfersQuery.where(
      DeviceTransferTable.default.columns.deviceNumber.name,
      deviceNumber,
    );
  }

  if (isComplete !== undefined && !isComplete) {
    transfersQuery.whereNull(
      DeviceTransferTable.default.columns.completedAt.name,
    );
  }
  if (isComplete !== undefined && isComplete) {
    transfersQuery.whereNotNull(
      DeviceTransferTable.default.columns.completedAt.name,
    );
  }

  if (limit !== undefined) {
    transfersQuery.limit(limit);
  }
  if (offset !== undefined) {
    transfersQuery.offset(offset);
  }
  const transfers = await transfersQuery;

  return deviceTransferSearchResultSchema.array().parse(transfers);
}
