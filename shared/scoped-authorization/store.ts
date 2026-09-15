import { and, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoardEditors, scoreboardPrimeStatusMapping, scoreboardWidgets } from "../../database/schema";

// Acesso a banco fora de um store.ts por feature — exceção deliberada (mesmo espírito das
// exceções do broadcast, shared/scoped-authorization/store.ts): esta checagem de "está atribuído
// a este board" é usada por vários handlers espalhados entre features/boards, features/widgets e
// features/prime-*, e nenhum deles é dono natural dela.
export async function isUserAssignedToBoard(boardId: string, userId: string): Promise<boolean> {
  const [row] = await db
    .select({ boardId: scoreboardBoardEditors.boardId })
    .from(scoreboardBoardEditors)
    .where(and(eq(scoreboardBoardEditors.boardId, boardId), eq(scoreboardBoardEditors.userId, userId)));
  return Boolean(row);
}

// Usado por list-boards pra filtrar o resultado quando o ator só tem a permission estreita
// (scoreboard.boards.manage), não a ampla (scoreboard.manage).
export async function findBoardIdsAssignedToUser(userId: string): Promise<string[]> {
  const rows = await db
    .select({ boardId: scoreboardBoardEditors.boardId })
    .from(scoreboardBoardEditors)
    .where(eq(scoreboardBoardEditors.userId, userId));
  return rows.map((row) => row.boardId);
}

// update-widget/delete-widget/set-widget-manual-value só recebem widgetId, não boardId — precisa
// resolver o pai antes de checar atribuição (mesmo padrão de findAgendaIdByEventId do broadcast).
export async function findBoardIdByWidgetId(widgetId: string): Promise<string | null> {
  const [row] = await db.select({ boardId: scoreboardWidgets.boardId }).from(scoreboardWidgets).where(eq(scoreboardWidgets.id, widgetId)).limit(1);
  return row?.boardId ?? null;
}

// update-prime-status-mapping/delete-prime-status-mapping só recebem mappingId — mesmo padrão de
// findBoardIdByWidgetId acima.
export async function findBoardIdByMappingId(mappingId: string): Promise<string | null> {
  const [row] = await db
    .select({ boardId: scoreboardPrimeStatusMapping.boardId })
    .from(scoreboardPrimeStatusMapping)
    .where(eq(scoreboardPrimeStatusMapping.id, mappingId))
    .limit(1);
  return row?.boardId ?? null;
}
