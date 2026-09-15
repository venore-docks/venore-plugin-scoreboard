import { desc } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardPrimeSyncLog } from "../../database/schema";
import type { PrimeSyncLogRecord } from "../../contracts/types";

const RECENT_LOG_LIMIT = 20;

export async function findRecentSyncLogs(): Promise<PrimeSyncLogRecord[]> {
  const rows = await db
    .select()
    .from(scoreboardPrimeSyncLog)
    .orderBy(desc(scoreboardPrimeSyncLog.startedAt))
    .limit(RECENT_LOG_LIMIT);
  return rows as PrimeSyncLogRecord[];
}
