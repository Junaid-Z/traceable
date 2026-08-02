import { type Knex } from "knex";
import { connection } from "./connection.lib.js";

export type Ref = Knex.Ref<string, Record<string, string>>;

export type DatabaseEntityParams = {
  name: string;
  parentName?: string;
  alias?: string;
};

export abstract class DatabaseEntity {
  #name: string;
  get name() {
    return this.#name;
  }
  #parentName: string | undefined;
  get parentName() {
    return this.#parentName;
  }
  #alias: string;
  get alias() {
    return this.#alias;
  }
  get originalName() {
    return this.name;
  }
  get originalRef(): Ref {
    const isParentProvided = Boolean(this.parentName);
    const originalRef = connection.ref(
      isParentProvided ? `${this.parentName}.${this.name}` : this.name,
    );
    return originalRef;
  }
  get ref(): Ref {
    const isTableProvided = Boolean(this.parentName);
    const originalRef = connection.ref(
      isTableProvided ? `${this.parentName}.${this.alias}` : this.alias,
    );
    return originalRef;
  }
  get aliasedRef(): Ref {
    const ref = this.originalRef;
    if (this.name !== this.alias) ref.as(this.alias);
    return ref;
  }
  constructor(params: DatabaseEntityParams) {
    const { name, alias, parentName } = params;
    this.#name = name;
    this.#alias = alias ?? name;
    this.#parentName = parentName;
  }
}

export interface ColumnParams extends Omit<DatabaseEntityParams, "parentName"> {
  tableName?: string;
}

export class Column extends DatabaseEntity {
  constructor(params: ColumnParams) {
    const { tableName: parentName, ...rest } = params;
    super({ parentName, ...rest });
  }
}

export type TableColumnParams = Omit<ColumnParams, "tableName">;

export interface TableParams<Columns extends string> extends Omit<
  DatabaseEntityParams,
  "parentName"
> {
  columns: Record<Columns, TableColumnParams>;
  schemaName?: string;
}

export abstract class Table<Columns extends string> extends DatabaseEntity {
  #columns = {} as Record<Columns, DatabaseEntity>;
  get columns() {
    return this.#columns;
  }
  constructor(params: TableParams<Columns>) {
    const { name, alias, schemaName: parentName, columns } = params;
    super({ name, alias, parentName });
    for (const key in columns) {
      const typeSafeKey = key as keyof typeof columns;
      const typeSafeColumnParams = columns[typeSafeKey] as TableColumnParams;

      const tableIdentifier = alias ?? name;
      this.#columns[typeSafeKey] = new Column({
        ...typeSafeColumnParams,
        tableName: parentName
          ? `${parentName}.${tableIdentifier}`
          : tableIdentifier,
      });
    }
  }
}

export interface ImmutableTableParams<Columns extends string> extends Omit<
  TableParams<Columns>,
  "columns"
> {
  defaultColumnConfig: Record<Columns, TableColumnParams>;
  columns?: Partial<Record<Columns, string>>;
}

export abstract class ImmutableTable<
  Columns extends string,
> extends Table<Columns> {
  constructor(params: ImmutableTableParams<Columns>) {
    const {
      name,
      defaultColumnConfig,
      columns: columnAlias,
      alias: tableAlias,
      schemaName,
    } = params;
    const columnConfig: Record<string, ColumnParams> = {};

    // Overwrite alias in defaultColumnConfig with provided value
    for (const colKey in defaultColumnConfig) {
      const typeSafeColKey = colKey as keyof typeof defaultColumnConfig;
      const defaultDefinition = defaultColumnConfig[typeSafeColKey];
      const alias = columnAlias?.[typeSafeColKey];

      columnConfig[typeSafeColKey] = {
        ...defaultDefinition,
        alias: alias ?? defaultDefinition.alias,
      };
    }

    super({
      alias: tableAlias,
      schemaName,
      name,
      columns: columnConfig,
    });
  }
}
