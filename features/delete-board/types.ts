import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteBoardInput = { boardId: string };
export type DeleteBoardResult = OperationResult<{ id: string }>;
