import {
  ImmutableTable,
  type ImmutableTableParams,
  type TableColumnParams,
} from "../../shared/lib/database.lib.js";

export const USER_TABLE_NAME = "user";

export const defaultColumnConfig = {
  id: { name: "id" },
  displayName: { name: "display_name" },
  username: { name: "username" },
  password: { name: "password" },
  nic: { name: "nic" },
  role: { name: "role" },
  salary: { name: "salary" },
  contact: { name: "contact" },
  address: { name: "address" },
  active: { name: "active" },
} satisfies Record<string, TableColumnParams>;

export interface UserTableParams extends Omit<
  ImmutableTableParams<keyof typeof defaultColumnConfig>,
  "name" | "defaultColumnConfig"
> {}

export class UserTable extends ImmutableTable<
  keyof typeof defaultColumnConfig
> {
  static default = new UserTable({ schemaName: "public" });
  constructor(params: UserTableParams) {
    const { alias, columns, schemaName } = params;
    super({
      name: USER_TABLE_NAME,
      defaultColumnConfig,
      alias,
      columns,
      schemaName,
    });
  }
}
