import {
  ImmutableTable,
  type ImmutableTableParams,
  type TableColumnParams,
} from "@shared/lib/database.lib.js";

export const TABLE_NAME = "device_user";

export const defaultColumnConfig = {
  device: {
    name: "device",
  },
  user: {
    name: "user",
  },
} satisfies Record<string, TableColumnParams>;

export interface DeviceUserParams extends Omit<
  ImmutableTableParams<keyof typeof defaultColumnConfig>,
  "name" | "defaultColumnConfig"
> {}

export class DeviceUserTable extends ImmutableTable<
  keyof typeof defaultColumnConfig
> {
  static default = new DeviceUserTable({
    schemaName: "public",
  });
  constructor(params: DeviceUserParams) {
    const { alias, columns, schemaName } = params;
    super({
      alias,
      columns,
      schemaName,
      name: TABLE_NAME,
      defaultColumnConfig,
    });
  }
}
