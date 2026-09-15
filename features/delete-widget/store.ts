import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardWidgets } from "../../database/schema";

export async function deleteWidgetById(id: string): Promise<{ boardId: string } | null> {
  const [row] = await db
    .delete(scoreboardWidgets)
    .where(eq(scoreboardWidgets.id, id))
    .returning({ boardId: scoreboardWidgets.boardId });
  return row ?? null;
}
