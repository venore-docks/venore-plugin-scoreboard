import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoardEditors, scoreboardBoards } from "../../database/schema";
import type { BoardRecord } from "../../contracts/types";

export async function findBoardById(id: string): Promise<BoardRecord | null> {
  const [row] = await db.select().from(scoreboardBoards).where(eq(scoreboardBoards.id, id)).limit(1);
  return (row as BoardRecord) ?? null;
}

// Substitui o conjunto inteiro de responsáveis deste board — mesmo padrão de
// venore-plugin-broadcast/features/agenda/set-agenda-editors/store.ts (replaceAgendaEditors).
// userIds=[] é um estado válido: "este board não tem responsável nenhum atribuído"
// (scoreboard.manage continua editando normalmente, só quem só tem scoreboard.boards.manage fica
// sem acesso até alguém ser atribuído).
export async function replaceBoardEditors(boardId: string, userIds: string[]): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(scoreboardBoardEditors).where(eq(scoreboardBoardEditors.boardId, boardId));
    if (userIds.length > 0) {
      await tx.insert(scoreboardBoardEditors).values(userIds.map((userId) => ({ boardId, userId })));
    }
  });
}
