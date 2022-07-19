import { QueryInterface } from 'sequelize';
import { RenameColumnParameters, RenameTableParameters } from '../types';
import { buildCreateTriggerStatement } from './helpers/buildCreateTriggerStatement';
import { buildDropTriggerStatement } from './helpers/buildDropTriggerStatement';
import { getForeignKeyReferencesWithTriggers } from './helpers/getForeignKeyReferencesWithTriggers';
import { getForeignKeysWithTriggers } from './helpers/getForeignKeysWithTriggers';
import { getPrimaryKeyName } from './helpers/getPrimaryKeyName';

export const RENAME_COLUMN_COMMAND_NAME = 'renameColumn';

export const renameColumn = async (target: QueryInterface, parameters: RenameColumnParameters) => {
  const [tableName, _oldColumnName, newColumnName] = parameters;

  const foreignKeyReferencesWithTriggers = await getForeignKeyReferencesWithTriggers(
    tableName as string,
    target,
  );

  const primaryKey = await getPrimaryKeyName(tableName as string, target);

  const foreignKeysWithTriggers = await getForeignKeysWithTriggers(
    tableName as string,
    primaryKey!,
    target,
  );

  const commandResult = await Reflect.apply(
    (target as Record<string, any>)[RENAME_COLUMN_COMMAND_NAME],
    target,
    parameters,
  );

  // table acting as a dependent table
  if (foreignKeyReferencesWithTriggers.length) {
    await Promise.all(
      foreignKeyReferencesWithTriggers.map(({ referencedTableName }) =>
        target.sequelize.query(buildDropTriggerStatement(referencedTableName, tableName as string)),
      ),
    );

    await Promise.all(
      foreignKeyReferencesWithTriggers.map(({ referencedTableName, referencedColumnName }) =>
        target.sequelize.query(
          buildCreateTriggerStatement(
            referencedTableName,
            referencedColumnName,
            tableName as string,
            newColumnName,
          ),
        ),
      ),
    );
  }

  // acting as a independent table implementation
  if (foreignKeysWithTriggers.length) {
    await Promise.all(
      foreignKeysWithTriggers.map(({ tableName: foreignTableName }) =>
        target.sequelize.query(buildDropTriggerStatement(tableName as string, foreignTableName)),
      ),
    );

    await Promise.all(
      foreignKeysWithTriggers.map(({ tableName: foreignTableName, columnName: foreignColumnName }) =>
        target.sequelize.query(
          buildCreateTriggerStatement(
            tableName as string,
            newColumnName,
            foreignTableName,
            foreignColumnName,
          ),
        ),
      ),
    );
  }

  return commandResult;
};
