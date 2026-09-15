import type { OperationResult } from "@venore/plugin-sdk";

export type SetBoardEditorsCommand = { boardId: string; userIds: string[]; actorId: string };
export type SetBoardEditorsInput = Omit<SetBoardEditorsCommand, "actorId">;
export type SetBoardEditorsResult = OperationResult<{ boardId: string; userIds: string[] }>;
