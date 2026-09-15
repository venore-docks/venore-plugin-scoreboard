import { notFound, redirect } from "next/navigation";
import { isPluginActive } from "@venore/plugin-sdk";
import { findBoardIdBySlug, getBoardView } from "../../index";
import { BoardCanvas } from "../../components/board-view/board-canvas";

export const dynamic = "force-dynamic";

// Tela web autenticada, dentro da shell do site — /scoreboard/:slug. A versão pra TV
// (fullscreen, sem shell) mora em routes/scoreboard-tv, resolvida via /ext/scoreboard/tv/:slug.
export default async function ScoreboardWebPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isPluginActive("scoreboard"))) {
    notFound();
  }

  const { slug } = await params;
  const boardId = await findBoardIdBySlug(slug);
  if (!boardId) {
    notFound();
  }

  const result = await getBoardView({ boardId });
  if (!result.success) {
    if (result.error.code === "rbac.authorization.unauthenticated") {
      redirect("/api/auth/signin");
    }
    notFound();
  }

  const { board } = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{board.name}</h1>
        <p className="text-sm text-muted-foreground">
          {board.sector}
          {board.description ? ` — ${board.description}` : ""}
        </p>
      </div>
      <BoardCanvas boardId={boardId} initialView={result.data} />
    </div>
  );
}
