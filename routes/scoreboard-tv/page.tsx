import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isPluginActive } from "@venore/plugin-sdk";
import { findBoardIdBySlug, getBoardView } from "../../index";
import { BoardCanvas } from "../../components/board-view/board-canvas";

export const dynamic = "force-dynamic";

function TvMessage({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-10 text-center">
      <p className="text-lg text-muted-foreground">{children}</p>
    </div>
  );
}

// Rota standalone fora de (platform) de propósito — feita pra abrir em tela cheia numa TV como
// item "página web" de uma playlist do Broadcast Studio (quem transmite continua sendo o
// Broadcast; este plugin só serve a página). Gateada por sessão + permissão (getBoardView), ao
// contrário da saída do Broadcast que é por token anônimo — um board de indicadores não é feito
// pra qualquer um na rede local abrir.
export default async function ScoreboardTvPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isPluginActive("scoreboard"))) {
    return <TvMessage>O plugin de Indicadores está desabilitado.</TvMessage>;
  }

  const { slug } = await params;
  const boardId = await findBoardIdBySlug(slug);
  if (!boardId) {
    return <TvMessage>Quadro &quot;{slug}&quot; não encontrado.</TvMessage>;
  }

  const result = await getBoardView({ boardId });
  if (!result.success) {
    if (result.error.code === "rbac.authorization.unauthenticated") {
      redirect("/api/auth/signin");
    }
    return <TvMessage>{result.error.message}</TvMessage>;
  }

  const { board } = result.data;

  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{board.name}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{board.sector}</p>
        </div>
        <BoardCanvas boardId={boardId} initialView={result.data} />
      </div>
    </div>
  );
}
