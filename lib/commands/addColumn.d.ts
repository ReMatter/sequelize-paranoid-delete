import { ModelAttributeColumnOptions, QueryInterface } from 'sequelize';
import { Options } from '../types';
export declare const ADD_COLUMN_COMMAND_NAME = "addColumn";
export declare const addColumn: (target: QueryInterface, parameters: [table: import("sequelize").TableName, key: string, attribute: import("sequelize").DataType | ModelAttributeColumnOptions<import("sequelize").Model<any, any>>, options?: import("sequelize").QueryInterfaceOptions | undefined], options?: Options | undefined) => Promise<any>;
