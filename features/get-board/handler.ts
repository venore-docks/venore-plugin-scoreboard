import { authorizeBoardActor } from "../../shared/scoped-authorization";
import { getBoard } from "./service";
import type { GetBoardInput, GetBoardResult } from "./types";

// Board cru (ignora `published`), pro editor do admin — quem só pode ver o board publicado
// (authorizeBoardReadActor) usa get-board-view, não este.
export async function getBoardHandler(input: GetBoardInput): Promise<GetBoardResult> {
  const authz = await authorizeBoardActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return getBoard(input);
}
