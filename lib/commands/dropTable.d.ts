import { QueryInterface } from 'sequelize';
import { Options } from '../types';
export declare const DROP_TABLE_COMMAND_NAME = "dropTable";
export declare const dropTable: (target: QueryInterface, parameters: [tableName: import("sequelize").TableName, options?: import("sequelize").QueryInterfaceDropTableOptions | undefined], options?: Options | undefined) => Promise<any>;
