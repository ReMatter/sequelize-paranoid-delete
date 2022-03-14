import { QueryInterface } from 'sequelize';
import { ForeignKeyFields } from '../../types';
export declare const getForeignKeyReferencesWithTriggers: (tableName: string, target: QueryInterface) => Promise<ForeignKeyFields[]>;
