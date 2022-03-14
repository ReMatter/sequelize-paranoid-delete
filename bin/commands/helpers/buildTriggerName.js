"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTriggerName = void 0;
const buildTriggerName = (primaryTable, foreignTable) => `on_${primaryTable}_delete_update_${foreignTable}`;
exports.buildTriggerName = buildTriggerName;
