#!/usr/bin/env node

import { Sequelize } from 'sequelize-typescript';
import { QueryInterface, QueryTypes } from 'sequelize';
import { getPrimaryKeyName } from './commands/helpers/getPrimaryKeyName';
import { ForeignKeyFields } from './types';
import { buildCreateTriggerStatement } from './commands/helpers/buildCreateTriggerStatement';
import { buildTriggerName } from './commands/helpers/buildTriggerName';

const dedupe = <T>(array: readonly T[], hasher: (e: T) => string): T[] => {
  const uniques: { [hash: string]: T } = {};

  array.forEach((item) => (uniques[hasher(item)] = item));

  return Object.values(uniques);
};

// TODO pass config as param
const sequelize = new Sequelize('rematter_default', 'root', 'password', {
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
  `,
    {
      type: QueryTypes.SELECT,
    },
  )) as { primaryTableName: string }[];

  const queryInterface: QueryInterface = sequelize.getQueryInterface();

  const foreignKeys = (
    await Promise.all(
      tables.map(async ({ primaryTableName }) => {
        const primaryTablePrimaryKeyName = await getPrimaryKeyName(
          primaryTableName,
          queryInterface,
        );

        if (!primaryTablePrimaryKeyName) {
          // views for example do not have primary keys
          return [];
        }
        return (await sequelize.query(
          // @ts-expect-error queryGenerator has no types and getForeignKeyQuery is private
          queryInterface.queryGenerator.getForeignKeyQuery(
            primaryTableName,
            primaryTablePrimaryKeyName,
          ),
          { type: QueryTypes.SELECT },
        )) as ForeignKeyFields[];
      }),
    )
  ).flat();

  const uniqueForeignKeys = dedupe(foreignKeys, ({ referencedTableName, tableName }) =>
    buildTriggerName(referencedTableName, tableName),
  );

  await Promise.all(
    uniqueForeignKeys
      .filter(({ referencedTableName }) =>
        tables.find((t) => t.primaryTableName === referencedTableName),
      )
      .map(({ tableName, columnName, referencedTableName, referencedColumnName }) =>
        sequelize.query(
          buildCreateTriggerStatement(
            referencedTableName,
            referencedColumnName,
            tableName,
            columnName,
          ),
        ),
      ),
  );
})();
