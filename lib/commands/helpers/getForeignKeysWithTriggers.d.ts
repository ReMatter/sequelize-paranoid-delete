import { QueryInterface } from 'sequelize';
import { ForeignKeyFields } from '../../types';
export declare const getForeignKeysWithTriggers: (tableName: string, primaryKey: string, target: QueryInterface) => Promise<ForeignKeyFields[]>;
