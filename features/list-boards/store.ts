import { asc } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoards } from "../../database/schema";
import type { BoardRecord } from "../../contracts/types";

export async function findAllBoards(): Promise<BoardRecord[]> {
  const rows = await db
    .select()
    .from(scoreboardBoards)
    .orderBy(asc(scoreboardBoards.order), asc(scoreboardBoards.createdAt), asc(scoreboardBoards.id));
  return rows as BoardRecord[];
}
