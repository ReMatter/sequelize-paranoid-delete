export const getPrimaryTableProps = (options, getPrimaryKey) => {
    const { references } = options;
    if (typeof references === 'string') {
        return { primaryTable: references, primaryKey: getPrimaryKey?.(references) ?? 'id' };
    }
    const model = references.model;
    return {
        primaryTable: model,
        primaryKey: references?.key ?? getPrimaryKey?.(model) ?? 'id',
    };
};
//# sourceMappingURL=getPrimaryTableProps.js.map