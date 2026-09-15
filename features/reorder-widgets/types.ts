import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

export type ReorderWidgetsCommand = { boardId: string; orderedWidgetIds: string[]; actorId: string };
export type ReorderWidgetsInput = Omit<ReorderWidgetsCommand, "actorId">;
export type ReorderWidgetsResult = OperationResult<WidgetRecord[]>;
