import { publishBoardEvent } from "../../runtime/board-bus";
import { deleteWidgetById } from "./store";
import type { DeleteWidgetInput, DeleteWidgetResult } from "./types";

export async function deleteWidget(input: DeleteWidgetInput): Promise<DeleteWidgetResult> {
  const deleted = await deleteWidgetById(input.widgetId);
  if (!deleted) {
    return { success: false, error: { code: "scoreboard.widgets.not_found", message: "Widget não encontrado." } };
  }
  publishBoardEvent(deleted.boardId, { type: "board-changed" });
  return { success: true, data: { id: input.widgetId, boardId: deleted.boardId } };
}
