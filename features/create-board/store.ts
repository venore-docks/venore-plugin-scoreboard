import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoards } from "../../database/schema";
import type { BoardRecord } from "../../contracts/types";

export async function findBoardBySlug(slug: string): Promise<BoardRecord | null> {
  const [row] = await db.select().from(scoreboardBoards).where(eq(scoreboardBoards.slug, slug)).limit(1);
  return (row as BoardRecord) ?? null;
}

export async function insertBoard(input: {
  name: string;
  sector: string;
  description: string | null;
  slug: string;
  createdByUserId: string;
}): Promise<BoardRecord> {
  const [row] = await db.insert(scoreboardBoards).values(input).returning();
  return row as BoardRecord;
}
