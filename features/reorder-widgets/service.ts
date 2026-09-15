import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { reorderWidgets as applyReorder } from "./store";
import type { ReorderWidgetsCommand, ReorderWidgetsResult } from "./types";

export async function reorderWidgets(command: ReorderWidgetsCommand): Promise<ReorderWidgetsResult> {
  const handle = beginOperation({
    useCase: "scoreboard.reorder-widgets",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const widgets = await applyReorder(command.boardId, command.orderedWidgetIds);

  endOperation(handle, { success: true });
  publishBoardEvent(command.boardId, { type: "board-changed" });
  return { success: true, data: widgets };
}
