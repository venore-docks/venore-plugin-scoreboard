import type { OperationResult } from "@venore/plugin-sdk";
import type { BoardWithWidgets } from "../../contracts/types";

export type GetBoardInput = { boardId: string };
export type GetBoardResult = OperationResult<BoardWithWidgets>;
