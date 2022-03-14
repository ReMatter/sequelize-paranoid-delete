import { buildCreateTriggerStatement } from './helpers/buildCreateTriggerStatement';
import { getPrimaryTableProps } from './helpers/getPrimaryTableProps';
import { hasParanoidCascadeOnDelete } from './helpers/hasParanoidCascadeOnDelete';
export const CREATE_TABLE_COMMAND_NAME = 'createTable';
export const createTable = async (target, parameters, options) => {
    const [newTable, columns] = parameters;
    const createTriggers = [];
    Object.entries(columns).forEach(([foreignKey, columnDescription]) => {
        if (hasParanoidCascadeOnDelete(columnDescription)) {
            const { primaryTable, primaryKey } = getPrimaryTableProps(columnDescription, options?.getPrimaryKey);
            createTriggers.push(buildCreateTriggerStatement(primaryTable, primaryKey, newTable, foreignKey));
            // 'PARANOID CASCADE' is not a REAL accepted SQL value
            delete columnDescription.onDelete;
        }
    });
    const commandResult = await Reflect.apply(target[CREATE_TABLE_COMMAND_NAME], target, parameters);
    await Promise.all(createTriggers.map((t) => target.sequelize.query(t)));
    return commandResult;
};
//# sourceMappingURL=createTable.js.map