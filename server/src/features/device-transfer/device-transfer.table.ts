import {
  ImmutableTable,
  type ImmutableTableParams,
  type TableColumnParams,
} from "../../shared/lib/database.lib.js";

export const TABLE_NAME = "device_transfer";

export const defaultColumnConfig = {
  id: { name: "id" },
  publicId: { name: "public_id" },
  deviceNumber: {
    name: "device_number",
  },
  toUser: {
    name: "to_user",
  },
  fromUser: {
    name: "from_user",
  },
  completedAt: {
    name: "completed_at",
  },
} satisfies Record<string, TableColumnParams>;

export interface DeviceTransferTableParams extends Omit<
  ImmutableTableParams<keyof typeof defaultColumnConfig>,
  "name" | "defaultColumnConfig"
> {}

export class DeviceTransferTable extends ImmutableTable<
  keyof typeof defaultColumnConfig
> {
  default = new DeviceTransferTable({ schemaName: "public" });
  constructor(params: DeviceTransferTableParams) {
    const { alias, columns, schemaName } = params;
    super({
      schemaName,
      name: TABLE_NAME,
      alias,
      columns,
      defaultColumnConfig,
    });
  }
}
