import { authorizeBoardActor } from "../../shared/scoped-authorization";
import { updateBoard } from "./service";
import { validateUpdateBoardInput } from "./validation";
import type { UpdateBoardInput, UpdateBoardResult } from "./types";

export async function updateBoardHandler(input: UpdateBoardInput): Promise<UpdateBoardResult> {
  const validationError = validateUpdateBoardInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeBoardActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateBoard({ ...input, actorId: authz.actorId });
}
