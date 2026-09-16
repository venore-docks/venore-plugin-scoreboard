import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { assignWidgetGroup } from "./service";
import type { AssignWidgetGroupInput, AssignWidgetGroupResult } from "./types";

export async function assignWidgetGroupHandler(input: AssignWidgetGroupInput): Promise<AssignWidgetGroupResult> {
  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return assignWidgetGroup({ ...input, actorId: authz.actorId });
}
