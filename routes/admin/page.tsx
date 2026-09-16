import Link from "next/link";
import { Gauge, GraduationCap, RefreshCw } from "lucide-react";
import { listBoards } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, AdminPageHeader, Badge, Button, EmptyState } from "@venore/plugin-sdk/ui";
import { CreateBoardDialog } from "./create-board-dialog";
import { DeleteBoardButton } from "./delete-board-button";

export default async function ScoreboardAdminPage() {
  const gate = await getPluginAdminPageData("scoreboard");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para ver os quadros de indicadores." />;
  }

  const result = await listBoards();
  if (!result.success) {
    return <p className="text-sm text-destructive">Erro ao carregar quadros: {result.error.message}</p>;
  }

  const boards = result.data;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Indicadores"
        description="Quadros de metas, funil de matrícula e métricas por setor — consumíveis na web e como tela de TV pelo Broadcast Studio."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/admin/scoreboard/groups">
                <GraduationCap className="size-4" />
                Cursos e segmentos
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/scoreboard/prime-sync">
                <RefreshCw className="size-4" />
                Sincronização Prime
              </Link>
            </Button>
            <CreateBoardDialog />
          </>
        }
      />

      {boards.length === 0 ? (
        <EmptyState
          icon={<Gauge className="size-8" strokeWidth={1.5} />}
          title="Nenhum quadro criado ainda"
          description="Crie o primeiro quadro para começar a publicar indicadores."
          action={<CreateBoardDialog />}
        />
      ) : (
        <div className="overflow-x-auto rounded-panel border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
                <th className="px-4 py-2 font-semibold">Quadro</th>
                <th className="px-3 py-2 font-semibold">Setor</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Web</th>
                <th className="px-3 py-2 font-semibold">TV (Broadcast)</th>
                <th className="px-3 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {boards.map((board) => (
                <tr key={board.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/scoreboard/${board.id}`} className="font-medium text-foreground hover:underline">
                      {board.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{board.sector}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={board.published ? "default" : "outline"} className="text-[10px]">
                      {board.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link href={`/scoreboard/${board.slug}`} target="_blank" className="text-xs text-primary hover:underline">
                      /scoreboard/{board.slug}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link href={`/ext/scoreboard/tv/${board.slug}`} target="_blank" className="text-xs text-primary hover:underline">
                      /ext/scoreboard/tv/{board.slug}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <DeleteBoardButton boardId={board.id} boardName={board.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
