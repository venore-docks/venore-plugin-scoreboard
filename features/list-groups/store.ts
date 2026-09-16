import { asc } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardGroups } from "../../database/schema";
import type { GroupRecord } from "../../contracts/types";

export async function findAllGroups(): Promise<GroupRecord[]> {
  const rows = await db.select().from(scoreboardGroups).orderBy(asc(scoreboardGroups.order), asc(scoreboardGroups.label));
  return rows as GroupRecord[];
}
