import { QueryInterface } from 'sequelize';
export declare const getPrimaryKeyName: (tableName: string, target: QueryInterface) => Promise<string | undefined>;
