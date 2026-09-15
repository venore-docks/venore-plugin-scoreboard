import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listBoards } from "./service";
import type { ListBoardsResult } from "./types";

// Quem só tem scoreboard.boards.manage (não scoreboard.manage/scoreboard.read) vê só os boards
// atribuídos a ele — ver shared/scoped-authorization/index.ts pro racional completo.
export async function listBoardsHandler(): Promise<ListBoardsResult> {
  const full = await authorizeActor(["scoreboard.manage", "scoreboard.read"]);
  if (full.authorized) return listBoards();

  const scoped = await authorizeActor("scoreboard.boards.manage");
  if (!scoped.authorized) return { success: false, error: scoped.error };

  return listBoards({ assignedToUserId: scoped.actorId });
}
