import { QueryTypes } from 'sequelize';
import { buildExistTriggerStatement } from './buildExistTriggerStatement';
import { unwrapSelectOneValue } from './unwrapSelectOneValue';
export const getForeignKeysWithTriggers = async (tableName, primaryKey, target) => {
    // we look for tables that reference this table (acting as a independent table)
    const foreignKeys = (await target.sequelize.query(
    // @ts-expect-error queryGenerator has no types and getForeignKeyQuery is private
    target.queryGenerator.getForeignKeyQuery(tableName, primaryKey), { type: QueryTypes.SELECT }));
    return (await Promise.all(foreignKeys.map(async ({ referencedTableName, tableName, columnName }) => {
        const triggerExists = !!unwrapSelectOneValue(await target.sequelize.query(buildExistTriggerStatement(referencedTableName, tableName), {
            type: QueryTypes.SELECT,
        }));
        return triggerExists ? { tableName, columnName } : null;
    }))).filter((field) => !!field);
};
//# sourceMappingURL=getForeignKeysWithTriggers.js.map