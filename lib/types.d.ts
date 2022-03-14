import { QueryInterface } from 'sequelize';
export declare type CreateTableParameters = Parameters<typeof QueryInterface.prototype.createTable>;
export declare type RenameTableParameters = Parameters<typeof QueryInterface.prototype.renameTable>;
export declare type DropTableParameters = Parameters<typeof QueryInterface.prototype.dropTable>;
export declare type AddColumnParameters = Parameters<typeof QueryInterface.prototype.addColumn>;
export declare type AddColumnAttributeParameter = AddColumnParameters[2];
export declare type Options = {
    getPrimaryKey?: (primaryTable: string) => string;
};
export declare type ForeignKeyFields = {
    tableName: string;
    columnName: string;
    referencedTableName: string;
    referencedColumnName: string;
};
