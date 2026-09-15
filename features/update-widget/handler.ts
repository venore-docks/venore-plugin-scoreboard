import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { updateWidget } from "./service";
import { validateUpdateWidgetInput } from "./validation";
import type { UpdateWidgetInput, UpdateWidgetResult } from "./types";

export async function updateWidgetHandler(input: UpdateWidgetInput): Promise<UpdateWidgetResult> {
  const validationError = validateUpdateWidgetInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateWidget({ ...input, actorId: authz.actorId });
}
