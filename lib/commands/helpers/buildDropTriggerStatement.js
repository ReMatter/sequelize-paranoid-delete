import { buildTriggerName } from './buildTriggerName';
export const buildDropTriggerStatement = (primaryTable, foreignTable) => /* sql */ `
  DROP TRIGGER ${buildTriggerName(primaryTable, foreignTable)}
`;
//# sourceMappingURL=buildDropTriggerStatement.js.map