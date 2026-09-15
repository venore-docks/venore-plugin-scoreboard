import { findRecentSyncLogs } from "./store";
import type { GetPrimeSyncStatusResult } from "./types";

export async function getPrimeSyncStatus(): Promise<GetPrimeSyncStatusResult> {
  return { success: true, data: await findRecentSyncLogs() };
}
