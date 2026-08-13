import { UserTable } from "@features/user/user.table.js";
import { connection } from "@shared/lib/connection.lib.js";
import { escapeSqlLike } from "@shared/utils/sql.utils.js";
import type { Knex } from "knex";
import type { DeviceType } from "./device.constants.js";
import { DeviceTable } from "./device.table.js";
import { deviceSearchResultSchema } from "./device.schema.js";

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
      [DeviceTable.default.columns.store.name]: store,
    });
    if (!trx) await client.commit();
  } catch (e) {
    if (!trx) await client.rollback();
    throw e;
  }
}

export type DeviceSearchParams = {
  query?: {
    deviceNumber?: string;
    deviceType?: DeviceType;
    store?: string;
    isTransferring?: boolean;
  };
  meta?: {
    limit?: number;
    offset?: number;
    exactDeviceNumberMatch?: boolean;
  };
};

const deviceTable = new DeviceTable({
  columns: {
    deviceNumber: "deviceNumber",
    deviceType: "deviceType",
    isTransferring: "isTransferring",
  },
});

const userTable = new UserTable({
  columns: {
    id: "store",
    username: "username",
    displayName: "displayName",
  },
});

export async function deviceSearch(
  params: DeviceSearchParams = {},
  trx?: Knex.Transaction,
) {
  const { query = {}, meta = {} } = params;
  const { deviceNumber, deviceType, store, isTransferring } = query;
  const { limit, offset, exactDeviceNumberMatch } = meta;
  const client = trx ?? connection;

  const devicesQuery = client(DeviceTable.default.name).select(
    deviceTable.columns.deviceNumber.aliasedRef,
    deviceTable.columns.deviceType.aliasedRef,
    deviceTable.columns.isTransferring.aliasedRef,
    userTable.columns.id.aliasedRef,
    userTable.columns.username.aliasedRef,
    userTable.columns.displayName.aliasedRef,
  );
  devicesQuery.join(
    userTable.ref,
    deviceTable.columns.store.name,
    userTable.columns.id.name,
  );

  if (deviceType) {
    devicesQuery.where({
      [deviceTable.columns.deviceType.name]: deviceType,
    });
  }
  if (store) {
    devicesQuery.where({
      [deviceTable.columns.store.name]: store,
    });
  }
  if (isTransferring !== undefined) {
    devicesQuery.where({
      [deviceTable.columns.isTransferring.name]: isTransferring,
    });
  }

  if (deviceNumber !== undefined && deviceNumber && !exactDeviceNumberMatch) {
    devicesQuery.whereLike(
      deviceTable.columns.deviceNumber.name,
      escapeSqlLike(deviceNumber) + "%",
    );
  }
  if (deviceNumber !== undefined && deviceNumber && exactDeviceNumberMatch) {
    devicesQuery.where(deviceTable.columns.deviceNumber.name, deviceNumber);
  }

  if (limit !== undefined) {
    devicesQuery.limit(limit);
  }
  if (offset !== undefined) {
    devicesQuery.offset(offset);
  }

  const device = await devicesQuery;
  return deviceSearchResultSchema.array().parse(device);
}
