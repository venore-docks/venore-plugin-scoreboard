import type { OperationResult } from "@venore/plugin-sdk";
import type { BoardRecord } from "../../contracts/types";

export type CreateBoardCommand = {
  name: string;
  sector: string;
  description?: string | null;
  slug?: string;
  actorId: string;
};

export type CreateBoardInput = Omit<CreateBoardCommand, "actorId">;
export type CreateBoardResult = OperationResult<BoardRecord>;
