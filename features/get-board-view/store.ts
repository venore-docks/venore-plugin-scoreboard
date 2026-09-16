import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoards, scoreboardGroups, scoreboardWidgets } from "../../database/schema";
import type { BoardRecord, BoardWithWidgets, GroupRecord, WidgetRecord } from "../../contracts/types";

// Mesma query de features/get-board/store.ts — duplicada de propósito (cada feature é dona da
// própria camada de dados, mesmo padrão de multiplos "findXById" repetidos entre features do
// broadcast) em vez de importar o store de outra feature.
export async function findBoardWithWidgets(boardId: string): Promise<BoardWithWidgets | null> {
  const [board] = await db.select().from(scoreboardBoards).where(eq(scoreboardBoards.id, boardId)).limit(1);
  if (!board) return null;

  const widgets = await db
    .select()
    .from(scoreboardWidgets)
    .where(eq(scoreboardWidgets.boardId, boardId))
    .orderBy(asc(scoreboardWidgets.order), asc(scoreboardWidgets.createdAt));

  return { ...(board as BoardRecord), widgets: widgets as WidgetRecord[] };
}

// Resolve o label (e demais campos do catálogo) das keys usadas por goal_progress/funnel deste
// board — chamado uma vez com o conjunto inteiro de keys, não por grupo, pra não fazer N queries.
export async function findGroupsByKeys(keys: string[]): Promise<GroupRecord[]> {
  if (keys.length === 0) return [];
  const rows = await db.select().from(scoreboardGroups).where(inArray(scoreboardGroups.key, keys));
  return rows as GroupRecord[];
}
