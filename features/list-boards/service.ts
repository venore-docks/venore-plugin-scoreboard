import { findBoardIdsAssignedToUser } from "../../shared/scoped-authorization";
import { findAllBoards } from "./store";
import type { ListBoardsResult } from "./types";

// assignedToUserId filtra pra só os boards atribuídos a este usuário — usado quando o ator só tem
// a permission estreita (scoreboard.boards.manage), não a ampla (scoreboard.manage/scoreboard.read),
// ver handler.ts.
export async function listBoards(options?: { assignedToUserId?: string }): Promise<ListBoardsResult> {
  const boards = await findAllBoards();
  if (!options?.assignedToUserId) return { success: true, data: boards };

  const allowedIds = new Set(await findBoardIdsAssignedToUser(options.assignedToUserId));
  return { success: true, data: boards.filter((board) => allowedIds.has(board.id)) };
}
