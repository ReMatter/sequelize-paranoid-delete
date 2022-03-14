"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTriggerName = void 0;
// MYSQL has a limit of 63 chars on triggers name
// if table 'big' we remove the vowels hoping the trigger name will fit in 63 chars
const MAX_TABLE_NAME_LENGTH = 24;
const buildTriggerName = (primaryTable, foreignTable) => `on_${primaryTable.length > MAX_TABLE_NAME_LENGTH
    ? primaryTable.replace(/[aeiou]/g, '')
    : primaryTable}_del_upd_${foreignTable.length > MAX_TABLE_NAME_LENGTH
    ? foreignTable.replace(/[aeiou]/g, '')
    : foreignTable}`;
exports.buildTriggerName = buildTriggerName;
