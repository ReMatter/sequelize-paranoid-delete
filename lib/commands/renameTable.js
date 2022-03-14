import { buildCreateTriggerStatement } from './helpers/buildCreateTriggerStatement';
import { buildDropTriggerStatement } from './helpers/buildDropTriggerStatement';
import { getForeignKeyReferencesWithTriggers } from './helpers/getForeignKeyReferencesWithTriggers';
import { getForeignKeysWithTriggers } from './helpers/getForeignKeysWithTriggers';
import { getPrimaryKeyName } from './helpers/getPrimaryKeyName';
export const RENAME_TABLE_COMMAND_NAME = 'renameTable';
export const renameTable = async (target, parameters) => {
    const [oldName, newName] = parameters;
    const foreignKeyReferencesWithTriggers = await getForeignKeyReferencesWithTriggers(oldName, target);
    const primaryKey = await getPrimaryKeyName(oldName, target);
    const foreignKeysWithTriggers = await getForeignKeysWithTriggers(oldName, primaryKey, target);
    const commandResult = await Reflect.apply(target[RENAME_TABLE_COMMAND_NAME], target, parameters);
    // table acting as a dependent table
    if (foreignKeyReferencesWithTriggers.length) {
        await Promise.all(foreignKeyReferencesWithTriggers.map(({ referencedTableName, referencedColumnName }) => target.sequelize.query(buildCreateTriggerStatement(referencedTableName, referencedColumnName, newName, primaryKey))));
        await Promise.all(foreignKeyReferencesWithTriggers.map(({ referencedTableName }) => target.sequelize.query(buildDropTriggerStatement(referencedTableName, oldName))));
    }
    // acting as a independent table implementation
    if (foreignKeysWithTriggers.length) {
        await Promise.all(foreignKeysWithTriggers.map(({ tableName, columnName }) => target.sequelize.query(buildCreateTriggerStatement(newName, primaryKey, tableName, columnName))));
        await Promise.all(foreignKeysWithTriggers.map(({ tableName }) => target.sequelize.query(buildDropTriggerStatement(oldName, tableName))));
    }
    return commandResult;
};
//# sourceMappingURL=renameTable.js.map