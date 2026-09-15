import { authorizeWidgetActor } from "../../shared/scoped-authorization";
import { deleteWidget } from "./service";
import type { DeleteWidgetInput, DeleteWidgetResult } from "./types";

export async function deleteWidgetHandler(input: DeleteWidgetInput): Promise<DeleteWidgetResult> {
  const authz = await authorizeWidgetActor(input.widgetId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deleteWidget(input);
}
