export const getPrimaryKeyName = async (tableName, target) => {
    const columnsDescription = await target.describeTable(tableName);
    return Object.entries(columnsDescription).find(([_, description]) => description.primaryKey)?.[0];
};
//# sourceMappingURL=getPrimaryKeyName.js.map