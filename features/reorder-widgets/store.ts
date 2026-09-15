import { asc, eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardWidgets } from "../../database/schema";
import type { WidgetRecord } from "../../contracts/types";

// Mesmo padrão de venore-plugin-broadcast/features/agenda/reorder-agendas/store.ts
// (reorderAgendas): recebe a lista final de ids na ordem desejada, grava o índice de cada um numa
// transação, devolve a lista já reordenada.
export async function reorderWidgets(boardId: string, orderedWidgetIds: string[]): Promise<WidgetRecord[]> {
  return db.transaction(async (tx) => {
    for (const [index, id] of orderedWidgetIds.entries()) {
      await tx
        .update(scoreboardWidgets)
        .set({ order: index, updatedAt: sql`now()` })
        .where(eq(scoreboardWidgets.id, id));
    }

    const rows = await tx
      .select()
      .from(scoreboardWidgets)
      .where(eq(scoreboardWidgets.boardId, boardId))
      .orderBy(asc(scoreboardWidgets.order));
    return rows as WidgetRecord[];
  });
}
