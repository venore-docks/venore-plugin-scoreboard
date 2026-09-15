import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { findBoardById, replaceBoardEditors } from "./store";
import type { SetBoardEditorsCommand, SetBoardEditorsResult } from "./types";

export async function setBoardEditors(command: SetBoardEditorsCommand): Promise<SetBoardEditorsResult> {
  const board = await findBoardById(command.boardId);
  if (!board) {
    return { success: false, error: { code: "scoreboard.boards.not_found", message: "Quadro não encontrado." } };
  }

  const handle = beginOperation({
    useCase: "scoreboard.set-board-editors",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  await replaceBoardEditors(command.boardId, command.userIds);

  endOperation(handle, { success: true });
  return { success: true, data: { boardId: command.boardId, userIds: command.userIds } };
}
