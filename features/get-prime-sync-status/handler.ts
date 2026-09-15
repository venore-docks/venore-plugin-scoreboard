import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { getPrimeSyncStatus } from "./service";
import type { GetPrimeSyncStatusResult } from "./types";

export async function getPrimeSyncStatusHandler(): Promise<GetPrimeSyncStatusResult> {
  const authz = await authorizeActor(["scoreboard.manage", "scoreboard.read"]);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return getPrimeSyncStatus();
}
