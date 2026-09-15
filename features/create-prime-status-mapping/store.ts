import { and, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardPrimeStatusMapping, scoreboardWidgets } from "../../database/schema";
import type { FunnelWidgetConfig } from "../../shared/widget-config/types";
import type { PrimeStatusMappingRecord } from "../../contracts/types";

export async function findMappingByRawStatus(boardId: string, rawStatus: string): Promise<PrimeStatusMappingRecord | null> {
  const [row] = await db
    .select()
    .from(scoreboardPrimeStatusMapping)
    .where(and(eq(scoreboardPrimeStatusMapping.boardId, boardId), eq(scoreboardPrimeStatusMapping.rawStatus, rawStatus)))
    .limit(1);
  return (row as PrimeStatusMappingRecord) ?? null;
}

// Etapas válidas pra esse board são a união das etapas de todos os widgets `funnel` do board — na
// prática hoje é sempre um único widget funnel por board, mas nada impede mais de um.
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

export async function insertMapping(input: {
  boardId: string;
  rawStatus: string;
  stageKey: string;
  label: string | null;
}): Promise<PrimeStatusMappingRecord> {
  const [row] = await db.insert(scoreboardPrimeStatusMapping).values(input).returning();
  return row as PrimeStatusMappingRecord;
}
