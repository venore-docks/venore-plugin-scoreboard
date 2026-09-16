import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createGroup } from "./service";
import { validateCreateGroupInput } from "./validation";
import type { CreateGroupInput, CreateGroupResult } from "./types";

// Só scoreboard.manage — o catálogo é compartilhado entre todos os boards, curadoria fica
// centralizada (mesmo racional documentado no plano: evitar quase-duplicatas criadas por editores
// escopados de boards diferentes).
export async function createGroupHandler(input: CreateGroupInput): Promise<CreateGroupResult> {
  const validationError = validateCreateGroupInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createGroup({ ...input, actorId: authz.actorId });
}
