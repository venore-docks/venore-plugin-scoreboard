import { authorizeBoardActor } from "../../shared/scoped-authorization";
import { createWidget } from "./service";
import { validateCreateWidgetInput } from "./validation";
import type { CreateWidgetInput, CreateWidgetResult } from "./types";

export async function createWidgetHandler(input: CreateWidgetInput): Promise<CreateWidgetResult> {
  const validationError = validateCreateWidgetInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeBoardActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createWidget({ ...input, actorId: authz.actorId });
}
