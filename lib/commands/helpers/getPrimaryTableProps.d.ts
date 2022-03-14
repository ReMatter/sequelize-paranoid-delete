import { ModelAttributeColumnOptions } from 'sequelize';
export declare const getPrimaryTableProps: (options: ModelAttributeColumnOptions, getPrimaryKey?: ((primaryTable: string) => string) | undefined) => {
    primaryTable: string;
    primaryKey: string;
};
