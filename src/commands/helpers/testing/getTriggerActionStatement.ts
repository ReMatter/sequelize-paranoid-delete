import { buildTriggerName } from '../buildTriggerName';

export const getTriggerActionStatement = (
  primaryTable: string,
  foreignTable: string,
): string => /* sql */ `
  SELECT
    ACTION_STATEMENT
  FROM
    INFORMATION_SCHEMA.TRIGGERS
  WHERE
    TRIGGER_NAME = '${buildTriggerName(primaryTable, foreignTable)}'
`;
