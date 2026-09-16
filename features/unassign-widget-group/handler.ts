import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { unassignWidgetGroup } from "./service";
import type { UnassignWidgetGroupInput, UnassignWidgetGroupResult } from "./types";

export async function unassignWidgetGroupHandler(input: UnassignWidgetGroupInput): Promise<UnassignWidgetGroupResult> {
  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return unassignWidgetGroup(input);
}
