import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteBoard } from "./service";
import type { DeleteBoardInput, DeleteBoardResult } from "./types";

// Só scoreboard.manage — apagar um quadro (e tudo dentro dele) é ação de admin, mesmo racional de
// create-board/handler.ts.
export async function deleteBoardHandler(input: DeleteBoardInput): Promise<DeleteBoardResult> {
  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deleteBoard(input);
}
