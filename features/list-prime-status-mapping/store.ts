import { asc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardPrimeStatusMapping } from "../../database/schema";
import type { PrimeStatusMappingRecord } from "../../contracts/types";

export async function findMappingsByBoard(boardId: string): Promise<PrimeStatusMappingRecord[]> {
  const rows = await db
    .select()
    .from(scoreboardPrimeStatusMapping)
    .where(eq(scoreboardPrimeStatusMapping.boardId, boardId))
    .orderBy(asc(scoreboardPrimeStatusMapping.rawStatus));
  return rows as PrimeStatusMappingRecord[];
}
