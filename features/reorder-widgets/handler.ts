import { authorizeBoardActor } from "../../shared/scoped-authorization";
import { reorderWidgets } from "./service";
import type { ReorderWidgetsInput, ReorderWidgetsResult } from "./types";

export async function reorderWidgetsHandler(input: ReorderWidgetsInput): Promise<ReorderWidgetsResult> {
  const authz = await authorizeBoardActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return reorderWidgets({ ...input, actorId: authz.actorId });
}
