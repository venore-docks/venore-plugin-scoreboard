import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { triggerPrimeSync } from "./service";
import type { TriggerPrimeSyncResult } from "./types";

// Só scoreboard.manage — disparar sync afeta todos os boards prime_sync de uma vez, não é uma
// ação por board (nem faria sentido escopar pra quem só tem scoreboard.boards.manage).
export async function triggerPrimeSyncHandler(): Promise<TriggerPrimeSyncResult> {
  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return triggerPrimeSync({ actorId: authz.actorId });
}
