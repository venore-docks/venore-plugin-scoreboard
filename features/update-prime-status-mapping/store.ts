import { and, eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardPrimeStatusMapping, scoreboardWidgets } from "../../database/schema";
import type { FunnelWidgetConfig } from "../../shared/widget-config/types";
import type { PrimeStatusMappingRecord } from "../../contracts/types";

export async function findMappingById(id: string): Promise<PrimeStatusMappingRecord | null> {
  const [row] = await db.select().from(scoreboardPrimeStatusMapping).where(eq(scoreboardPrimeStatusMapping.id, id)).limit(1);
  return (row as PrimeStatusMappingRecord) ?? null;
}

export async function findValidStageKeysForBoard(boardId: string): Promise<Set<string>> {
  const rows = await db
    .select({ config: scoreboardWidgets.config })
    .from(scoreboardWidgets)
    .where(and(eq(scoreboardWidgets.boardId, boardId), eq(scoreboardWidgets.kind, "funnel")));

  const stageKeys = new Set<string>();
  for (const row of rows) {
    const config = row.config as FunnelWidgetConfig;
    for (const stage of config.stages ?? []) stageKeys.add(stage.key);
  }
  return stageKeys;
}

export async function applyMappingUpdate(
  mappingId: string,
  changes: Partial<Pick<PrimeStatusMappingRecord, "stageKey" | "label">>,
): Promise<PrimeStatusMappingRecord> {
  const [row] = await db
    .update(scoreboardPrimeStatusMapping)
    .set({ ...changes, updatedAt: sql`now()` })
    .where(eq(scoreboardPrimeStatusMapping.id, mappingId))
    .returning();
  return row as PrimeStatusMappingRecord;
}
