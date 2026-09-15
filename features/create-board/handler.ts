import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createBoard } from "./service";
import { validateCreateBoardInput } from "./validation";
import type { CreateBoardInput, CreateBoardResult } from "./types";

// Só scoreboard.manage (full only, mirror create-agenda do broadcast) — criar um quadro novo é
// ação de admin, nunca de quem só tem a permission estreita atribuída a quadros existentes.
export async function createBoardHandler(input: CreateBoardInput): Promise<CreateBoardResult> {
  const validationError = validateCreateBoardInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createBoard({ ...input, actorId: authz.actorId });
}
