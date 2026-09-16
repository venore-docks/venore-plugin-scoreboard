import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { addWidgetItem } from "./service";
import { validateAddWidgetItemInput } from "./validation";
import type { AddWidgetItemInput, AddWidgetItemResult } from "./types";

export async function addWidgetItemHandler(input: AddWidgetItemInput): Promise<AddWidgetItemResult> {
  const validationError = validateAddWidgetItemInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return addWidgetItem({ ...input, actorId: authz.actorId });
}
