import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoards } from "../../database/schema";

// Widgets, board_editors e prime_status_mapping somem em cascata (FK onDelete: "cascade" no
// schema) — não precisa de limpeza manual aqui.
export async function deleteBoardById(id: string): Promise<boolean> {
  const rows = await db.delete(scoreboardBoards).where(eq(scoreboardBoards.id, id)).returning({ id: scoreboardBoards.id });
  return rows.length > 0;
}
