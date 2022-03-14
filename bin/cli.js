#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const getPrimaryKeyName_1 = require("./commands/helpers/getPrimaryKeyName");
const buildCreateTriggerStatement_1 = require("./commands/helpers/buildCreateTriggerStatement");
const buildTriggerName_1 = require("./commands/helpers/buildTriggerName");
const dedupe = (array, hasher) => {
    const uniques = {};
    array.forEach((item) => (uniques[hasher(item)] = item));
    return Object.values(uniques);
};
// TODO pass config as param
const sequelize = new sequelize_typescript_1.Sequelize('rematter_default', 'root', 'ingelheimamrhein', {
    dialect: 'mysql',
});
(async () => {
    const tables = (await sequelize.query(
    /* sql */ `
    SELECT DISTINCT
	    (TABLE_NAME) AS primaryTableName
    FROM
      INFORMATION_SCHEMA.COLUMNS
    WHERE
    	COLUMN_NAME = 'deletedAt'
  `, {
        type: sequelize_1.QueryTypes.SELECT,
    }));
    const queryInterface = sequelize.getQueryInterface();
    const foreignKeys = (await Promise.all(tables.map(async ({ primaryTableName }) => {
        const primaryTablePrimaryKeyName = await (0, getPrimaryKeyName_1.getPrimaryKeyName)(primaryTableName, queryInterface);
        if (!primaryTablePrimaryKeyName) {
            // views for example do not have primary keys
            return [];
        }
        return (await sequelize.query(
        // @ts-expect-error queryGenerator has no types and getForeignKeyQuery is private
        queryInterface.queryGenerator.getForeignKeyQuery(primaryTableName, primaryTablePrimaryKeyName), { type: sequelize_1.QueryTypes.SELECT }));
    }))).flat();
    const uniqueForeignKeys = dedupe(foreignKeys, ({ referencedTableName, tableName }) => (0, buildTriggerName_1.buildTriggerName)(referencedTableName, tableName));
    await Promise.all(uniqueForeignKeys
        .filter(({ referencedTableName }) => tables.find((t) => t.primaryTableName === referencedTableName))
        .map(({ tableName, columnName, referencedTableName, referencedColumnName }) => sequelize.query((0, buildCreateTriggerStatement_1.buildCreateTriggerStatement)(referencedTableName, referencedColumnName, tableName, columnName))));
})();
