import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { setWidgetManualValue } from "./service";
import { validateSetWidgetManualValueInput } from "./validation";
import type { SetWidgetManualValueInput, SetWidgetManualValueResult } from "./types";

export async function setWidgetManualValueHandler(input: SetWidgetManualValueInput): Promise<SetWidgetManualValueResult> {
  const validationError = validateSetWidgetManualValueInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return setWidgetManualValue({ ...input, actorId: authz.actorId });
}
