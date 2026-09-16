import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteGroupInput = { groupId: string };
export type DeleteGroupResult = OperationResult<{ id: string }>;
