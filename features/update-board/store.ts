import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoards } from "../../database/schema";
import type { BoardRecord } from "../../contracts/types";

export async function findBoardById(id: string): Promise<BoardRecord | null> {
  const [row] = await db.select().from(scoreboardBoards).where(eq(scoreboardBoards.id, id)).limit(1);
  return (row as BoardRecord) ?? null;
}

export async function applyBoardUpdate(
  boardId: string,
  changes: Partial<Pick<BoardRecord, "name" | "sector" | "description" | "order" | "published">>,
): Promise<BoardRecord> {
  const [row] = await db
    .update(scoreboardBoards)
    .set({ ...changes, updatedAt: sql`now()` })
    .where(eq(scoreboardBoards.id, boardId))
    .returning();
  return row as BoardRecord;
}
