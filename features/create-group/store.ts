import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardGroups } from "../../database/schema";
import type { GroupRecord } from "../../contracts/types";

export async function findGroupByKey(key: string): Promise<GroupRecord | null> {
  const [row] = await db.select().from(scoreboardGroups).where(eq(scoreboardGroups.key, key)).limit(1);
  return (row as GroupRecord) ?? null;
}

export async function insertGroup(input: { key: string; label: string; primeSegmentKey: string | null }): Promise<GroupRecord> {
  const [row] = await db.insert(scoreboardGroups).values(input).returning();
  return row as GroupRecord;
}
