import { deleteBoardById } from "./store";
import type { DeleteBoardInput, DeleteBoardResult } from "./types";

export async function deleteBoard(input: DeleteBoardInput): Promise<DeleteBoardResult> {
  const deleted = await deleteBoardById(input.boardId);
  if (!deleted) {
    return { success: false, error: { code: "scoreboard.boards.not_found", message: "Quadro não encontrado." } };
  }
  return { success: true, data: { id: input.boardId } };
}
