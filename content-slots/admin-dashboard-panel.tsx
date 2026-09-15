import Link from "next/link";
import type { ReactNode } from "react";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminStatTile, Badge } from "@venore/plugin-sdk/ui";
import { listBoardsHandler } from "../features/list-boards/handler";

// Painel principal de /admin — resumo dos quadros de indicadores. Contribuído via
// contributions.adminDashboardPanel; o core não conhece BoardRecord nem chama listBoards.
export async function renderScoreboardAdminDashboardPanel(): Promise<ReactNode> {
  const gate = await getPluginAdminPageData("scoreboard");
  if (!gate.granted) {
    return null;
  }

  const result = await listBoardsHandler();
  if (!result.success) {
    return null;
  }

  const boards = result.data;
  const published = boards.filter((board) => board.published);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AdminStatTile label="Quadros" value={boards.length} />
        <AdminStatTile label="Publicados" value={published.length} />
        <AdminStatTile label="Setores" value={new Set(boards.map((board) => board.sector)).size} />
      </div>

      <div className="rounded-panel border border-border bg-card shadow-panel">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Indicadores</h2>
          <Link href="/admin/scoreboard" className="text-xs font-medium text-primary hover:underline">
            Gerenciar
          </Link>
        </div>
        {boards.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Nenhum quadro criado ainda.</p>
        ) : (
          <ul className="divide-y divide-border">
            {boards.map((board) => (
              <li key={board.id}>
                <Link
                  href={`/admin/scoreboard/${board.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{board.name}</p>
                    <p className="truncate text-xs text-muted-foreground/56">{board.sector}</p>
                  </div>
                  <Badge variant={board.published ? "default" : "outline"} className="shrink-0 text-[10px]">
                    {board.published ? "Publicado" : "Rascunho"}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
