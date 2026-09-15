import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { applyBoardUpdate, findBoardById } from "./store";
import type { UpdateBoardCommand, UpdateBoardResult } from "./types";

export async function updateBoard(command: UpdateBoardCommand): Promise<UpdateBoardResult> {
  const existing = await findBoardById(command.boardId);
  if (!existing) {
    return { success: false, error: { code: "scoreboard.boards.not_found", message: "Quadro não encontrado." } };
  }

  const handle = beginOperation({
    useCase: "scoreboard.update-board",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const board = await applyBoardUpdate(command.boardId, {
    name: command.name?.trim(),
    sector: command.sector?.trim(),
    description: command.description === undefined ? undefined : command.description?.trim() || null,
    order: command.order,
    published: command.published,
  });

  endOperation(handle, { success: true });
  // Toda mutação que muda o estado visível de um board dispara o evento que atualiza a tela
  // web/TV via SSE quase imediatamente — ver runtime/board-bus.ts.
  publishBoardEvent(command.boardId, { type: "board-changed" });
  return { success: true, data: board };
}
