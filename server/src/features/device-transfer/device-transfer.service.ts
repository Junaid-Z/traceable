import { DeviceTable } from "@features/device/device.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import { generateRandomPublicId } from "@shared/utils/id.utils.js";
import { randomUUID } from "crypto";
import type { Knex } from "knex";
import {
  DeviceTransferCreateDeviceNotFoundError,
  DeviceTransferCreateDeviceSenderSameAsReceiverError,
} from "./device-transfer.lib.js";
import {
  DEVICE_TRANSFER_STAGE,
  deviceTransferSearchResultSchema,
  type DeviceTransferStage,
} from "./device-transfer.schemas.js";
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
    stage?: DeviceTransferStage | DeviceTransferStage[];
  };
  meta?: {
    limit?: number;
    offset?: number;
  };
};

const deviceTransferSearchTable = new DeviceTransferTable({
  columns: {
    id: "id",
    publicId: "publicId",
    deviceNumber: "deviceNumber",
    fromUser: "fromUser",
    toUser: "toUser",
    stage: "stage",
  },
});

export async function deviceTransferSearch(
  params: DeviceTransferSearchParams,
  trx?: Knex.Transaction,
) {
  const { query = {}, meta = {} } = params;
  const { id, deviceNumber, user, publicId, stage } = query;
  const { limit, offset } = meta;
  const client = trx ?? connection;

  const transfersQuery = client(DeviceTransferTable.default.name).select(
    deviceTransferSearchTable.columns.id.aliasedRef,
    deviceTransferSearchTable.columns.publicId.aliasedRef,
    deviceTransferSearchTable.columns.deviceNumber.aliasedRef,
    deviceTransferSearchTable.columns.fromUser.aliasedRef,
    deviceTransferSearchTable.columns.toUser.aliasedRef,
    deviceTransferSearchTable.columns.stage.aliasedRef,
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

  if (deviceNumber !== undefined && deviceNumber) {
    transfersQuery.where(
      DeviceTransferTable.default.columns.deviceNumber.name,
      deviceNumber,
    );
  }

  if (stage && typeof stage === "string") {
    transfersQuery.where(DeviceTransferTable.default.columns.stage.name, stage);
  } else if (stage && typeof stage === "object") {
    transfersQuery.where(function (clause) {
      for (const stg of stage) {
        clause.orWhere(DeviceTransferTable.default.columns.stage.name, stg);
      }
    });
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
