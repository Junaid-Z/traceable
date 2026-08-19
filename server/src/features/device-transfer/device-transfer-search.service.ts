import { connection } from "@shared/lib/connection.lib.js";
import type { Knex } from "knex";
import {
  deviceTransferSearchResultSchema,
  type DeviceTransferStage,
} from "./device-transfer.schemas.js";
import { DeviceTransferTable } from "./device-transfer.table.js";

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
