import { buildTriggerName } from './buildTriggerName';
export const buildExistTriggerStatement = (primaryTable, foreignTable) => /* sql */ `
SELECT
  EXISTS (
    SELECT
      1
    FROM
      INFORMATION_SCHEMA.TRIGGERS
    WHERE
      EVENT_OBJECT_TABLE = '${primaryTable}'
      AND TRIGGER_NAME = '${buildTriggerName(primaryTable, foreignTable)}'
  )
`;
//# sourceMappingURL=buildExistTriggerStatement.js.map