import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ListTree } from "lucide-react";
import { getBoard } from "../../index";
import { getPluginAdminPageData } from "@venore/plugin-sdk/admin";
import { AdminAccessDenied, Button } from "@venore/plugin-sdk/ui";
import { BoardSettingsForm } from "./board-settings-form";
import { BoardEditorsForm } from "./board-editors-form";
import { CreateWidgetForm } from "./create-widget-form";
import { WidgetCard } from "./widget-card";

export default async function ScoreboardAdminBoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const gate = await getPluginAdminPageData("scoreboard");
  if (!gate.granted) {
    return <AdminAccessDenied message="Você não tem permissão para editar este quadro." />;
  }

  const { boardId } = await params;
  const result = await getBoard({ boardId });
  if (!result.success) {
    notFound();
  }

  const board = result.data;
  const orderedWidgets = [...board.widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/admin/scoreboard">
              <ArrowLeft className="size-4" />
              Todos os quadros
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{board.name}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/admin/scoreboard/${board.id}/prime-mapping`}>
            <ListTree className="size-4" />
            Mapeamento Prime
          </Link>
        </Button>
      </div>

      <BoardSettingsForm
        boardId={board.id}
        name={board.name}
        sector={board.sector}
        description={board.description}
        published={board.published}
      />

      <BoardEditorsForm boardId={board.id} />

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-caps text-muted-foreground">Widgets</h2>
        {orderedWidgets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum widget ainda — adicione o primeiro abaixo.</p>
        ) : (
          <div className="space-y-4">
            {orderedWidgets.map((widget) => (
              <WidgetCard key={widget.id} boardId={board.id} widget={widget} />
            ))}
          </div>
        )}
        <CreateWidgetForm boardId={board.id} />
      </div>
    </div>
  );
}
