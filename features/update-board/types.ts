import type { OperationResult } from "@venore/plugin-sdk";
import type { BoardRecord } from "../../contracts/types";

export type UpdateBoardCommand = {
  boardId: string;
  name?: string;
  sector?: string;
  description?: string | null;
  order?: number;
  published?: boolean;
  actorId: string;
};

export type UpdateBoardInput = Omit<UpdateBoardCommand, "actorId">;
export type UpdateBoardResult = OperationResult<BoardRecord>;
