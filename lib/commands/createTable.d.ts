import { QueryInterface } from 'sequelize';
import { Options } from '../types';
export declare const CREATE_TABLE_COMMAND_NAME = "createTable";
export declare const createTable: (target: QueryInterface, parameters: [tableName: import("sequelize").TableName, attributes: import("sequelize").ModelAttributes<import("sequelize").Model<any, any>, any>, options?: import("sequelize").QueryInterfaceCreateTableOptions | undefined], options?: Options | undefined) => Promise<any>;
