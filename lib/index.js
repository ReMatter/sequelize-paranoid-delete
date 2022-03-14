import { addColumn, ADD_COLUMN_COMMAND_NAME } from './commands/addColumn';
import { createTable, CREATE_TABLE_COMMAND_NAME } from './commands/createTable';
import { dropTable, DROP_TABLE_COMMAND_NAME } from './commands/dropTable';
import { renameTable, RENAME_TABLE_COMMAND_NAME } from './commands/renameTable';
export const queryInterfaceDecorator = (queryInterface, options) => new Proxy(queryInterface, {
    get(target, propKey, _receiver) {
        if (propKey === 'sequelize') {
            return target[propKey];
        }
        const command = String(propKey);
        const origMethod = target[command];
        return async (...args) => {
            // here we may add a triggers to set the deletedAt field on the table being modified or created
            // when the referenced table is paranoid deleted
            if (command === ADD_COLUMN_COMMAND_NAME) {
                return addColumn(target, args, options);
            }
            if (command === CREATE_TABLE_COMMAND_NAME) {
                return createTable(target, args, options);
            }
            if (command === RENAME_TABLE_COMMAND_NAME) {
                return renameTable(target, args);
            }
            if (command === DROP_TABLE_COMMAND_NAME) {
                return dropTable(target, args);
            }
            return Reflect.apply(origMethod, target, args);
        };
    },
});
//# sourceMappingURL=index.js.map