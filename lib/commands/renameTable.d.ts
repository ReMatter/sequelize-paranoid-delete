import { QueryInterface } from 'sequelize';
export declare const RENAME_TABLE_COMMAND_NAME = "renameTable";
export declare const renameTable: (target: QueryInterface, parameters: [before: import("sequelize").TableName, after: import("sequelize").TableName, options?: import("sequelize").QueryInterfaceOptions | undefined]) => Promise<any>;
