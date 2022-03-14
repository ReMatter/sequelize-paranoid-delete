import { buildDropTriggerStatement } from './helpers/buildDropTriggerStatement';
import { getForeignKeyReferencesWithTriggers } from './helpers/getForeignKeyReferencesWithTriggers';
export const DROP_TABLE_COMMAND_NAME = 'dropTable';
export const dropTable = async (target, parameters, options) => {
    const [tableName] = parameters;
    const foreignKeyReferencesWithTriggers = await getForeignKeyReferencesWithTriggers(tableName, target);
    const commandResult = await Reflect.apply(target[DROP_TABLE_COMMAND_NAME], target, parameters);
    await Promise.all(foreignKeyReferencesWithTriggers.map(({ referencedTableName }) => target.sequelize.query(buildDropTriggerStatement(referencedTableName, tableName))));
    return commandResult;
};
//# sourceMappingURL=dropTable.js.map