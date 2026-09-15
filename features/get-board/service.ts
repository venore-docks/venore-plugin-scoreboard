import { findBoardWithWidgets } from "./store";
import type { GetBoardInput, GetBoardResult } from "./types";

export async function getBoard(input: GetBoardInput): Promise<GetBoardResult> {
  const board = await findBoardWithWidgets(input.boardId);
  if (!board) {
    return { success: false, error: { code: "scoreboard.boards.not_found", message: "Quadro não encontrado." } };
  }
  return { success: true, data: board };
}
