import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listGroups } from "./service";
import type { ListGroupsResult } from "./types";

// Qualquer um com alguma permission do plugin pode LER o catálogo — inclusive quem só tem
// scoreboard.boards.manage (editor escopado), pra poder atribuir um curso já cadastrado ao próprio
// board. Curadoria (criar/editar/apagar) continua só com scoreboard.manage, ver create-group/handler.ts.
export async function listGroupsHandler(): Promise<ListGroupsResult> {
  const authz = await authorizeActor(["scoreboard.manage", "scoreboard.read", "scoreboard.boards.manage"]);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listGroups();
}
