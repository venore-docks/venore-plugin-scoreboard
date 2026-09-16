import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { removeWidgetItem } from "./service";
import type { RemoveWidgetItemInput, RemoveWidgetItemResult } from "./types";

export async function removeWidgetItemHandler(input: RemoveWidgetItemInput): Promise<RemoveWidgetItemResult> {
  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return removeWidgetItem({ ...input, actorId: authz.actorId });
}
