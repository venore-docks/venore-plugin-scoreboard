import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { authorizeBoardReadActor } from "../../shared/scoped-authorization";
import { isUserAssignedToBoard } from "../../shared/scoped-authorization/store";
import { getBoardView } from "./service";
import type { GetBoardViewInput, GetBoardViewResult } from "./types";

// Board calculado (percentuais/funil prontos), pra web/TV/API — respeita `published`: quem só tem
// scoreboard.read (visualizador amplo, sem direito de gerenciar nada) não vê um board ainda não
// publicado. scoreboard.manage sempre vê (é quem monta o board antes de publicar); quem só tem a
// permission estreita também vê os PRÓPRIOS boards atribuídos mesmo despublicados (está montando).
export async function getBoardViewHandler(input: GetBoardViewInput): Promise<GetBoardViewResult> {
  const authz = await authorizeBoardReadActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  const result = await getBoardView(input);
  if (!result.success) return result;

  if (!result.data.board.published) {
    const isManager = await authorizeActor("scoreboard.manage");
    const isAssigned = isManager.authorized || (await isUserAssignedToBoard(input.boardId, authz.actorId));
    if (!isAssigned) {
      return { success: false, error: { code: "scoreboard.boards.not_found", message: "Quadro não encontrado." } };
    }
  }

  return result;
}
