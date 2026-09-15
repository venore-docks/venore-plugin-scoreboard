import type { OperationResult } from "@venore/plugin-sdk";
import type { BoardRecord } from "../../contracts/types";

export type ListBoardsResult = OperationResult<BoardRecord[]>;
