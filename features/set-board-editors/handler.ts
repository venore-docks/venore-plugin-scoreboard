import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { setBoardEditors } from "./service";
import type { SetBoardEditorsInput, SetBoardEditorsResult } from "./types";

// Só scoreboard.manage — decidir quem é responsável por um board é ação de admin, nunca do
// próprio editor atribuído (mesmo racional de set-agenda-editors/handler.ts).
export async function setBoardEditorsHandler(input: SetBoardEditorsInput): Promise<SetBoardEditorsResult> {
  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return setBoardEditors({ ...input, actorId: authz.actorId });
}
