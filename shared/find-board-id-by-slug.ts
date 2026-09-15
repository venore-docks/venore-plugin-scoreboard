import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardBoards } from "../database/schema";

// Infra pequena e sem autorização nenhuma (mesmo espírito de runtime/board-bus.ts) — as rotas web
// (/scoreboard/:slug) e TV (/ext/scoreboard/tv/:slug) resolvem slug -> boardId aqui antes de
// chamar getBoardView (que já autoriza por boardId); a API de estado/eventos recebe boardId direto
// na URL (resolvido uma vez no primeiro paint da página, não a cada poll).
export async function findBoardIdBySlug(slug: string): Promise<string | null> {
  const [row] = await db.select({ id: scoreboardBoards.id }).from(scoreboardBoards).where(eq(scoreboardBoards.slug, slug)).limit(1);
  return row?.id ?? null;
}
