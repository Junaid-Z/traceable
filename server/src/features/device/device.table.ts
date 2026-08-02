import {
  ImmutableTable,
  type ImmutableTableParams,
  type TableColumnParams,
} from "../../shared/lib/database.lib.js";

export const TABLE_NAME = "device";

export const defaultColumnConfig = {
  deviceNumber: {
    name: "device_number",
  },
  deviceDepartment: {
    name: "device_department",
  },
} satisfies Record<string, TableColumnParams>;

export interface DeviceTableParams extends Omit<
  ImmutableTableParams<keyof typeof defaultColumnConfig>,
  "name" | "defaultColumnConfig"
> {}

export class DeviceTable extends ImmutableTable<
  keyof typeof defaultColumnConfig
> {
  static default = new DeviceTable({
    schemaName: "public",
  });
  constructor(params: DeviceTableParams) {
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
