import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { findMaxWidgetOrder, insertWidget } from "./store";
import type { CreateWidgetCommand, CreateWidgetResult } from "./types";

export async function createWidget(command: CreateWidgetCommand): Promise<CreateWidgetResult> {
  const handle = beginOperation({
    useCase: "scoreboard.create-widget",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const nextOrder = (await findMaxWidgetOrder(command.boardId)) + 1;
  const widget = await insertWidget({
    boardId: command.boardId,
    kind: command.kind,
    title: command.title.trim(),
    order: nextOrder,
    dataSource: command.dataSource ?? "manual",
    config: command.config,
  });

  endOperation(handle, { success: true });
  publishBoardEvent(command.boardId, { type: "board-changed" });
  return { success: true, data: widget };
}
