import { buildCreateTriggerStatement } from './helpers/buildCreateTriggerStatement';
import { getPrimaryTableProps } from './helpers/getPrimaryTableProps';
import { hasParanoidCascadeOnDelete } from './helpers/hasParanoidCascadeOnDelete';
export const ADD_COLUMN_COMMAND_NAME = 'addColumn';
export const addColumn = async (target, parameters, options) => {
    const [foreignTable, foreignKey, columnDescription] = parameters;
    if (hasParanoidCascadeOnDelete(columnDescription)) {
        const { primaryTable, primaryKey } = getPrimaryTableProps(columnDescription, options?.getPrimaryKey);
        // 'PARANOID CASCADE' is not a REAL accepted SQL value
        delete columnDescription.onDelete;
        const commandResult = await Reflect.apply(target[ADD_COLUMN_COMMAND_NAME], target, parameters);
        const statement = buildCreateTriggerStatement(primaryTable, primaryKey, foreignTable, foreignKey);
        await target.sequelize.query(statement);
        return commandResult;
    }
};
//# sourceMappingURL=addColumn.js.map