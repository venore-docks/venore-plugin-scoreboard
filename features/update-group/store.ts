import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardGroups } from "../../database/schema";
import type { GroupRecord } from "../../contracts/types";

export async function findGroupById(id: string): Promise<GroupRecord | null> {
  const [row] = await db.select().from(scoreboardGroups).where(eq(scoreboardGroups.id, id)).limit(1);
  return (row as GroupRecord) ?? null;
}

export async function applyGroupUpdate(
  groupId: string,
  changes: Partial<Pick<GroupRecord, "label" | "primeSegmentKey">>,
): Promise<GroupRecord> {
  const [row] = await db
    .update(scoreboardGroups)
    .set({ ...changes, updatedAt: sql`now()` })
    .where(eq(scoreboardGroups.id, groupId))
    .returning();
  return row as GroupRecord;
}
