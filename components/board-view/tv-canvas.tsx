"use client";

import { useEffect, useState } from "react";
import type { ScoreboardLiveEvent } from "../../contracts/types";
import type { BoardView } from "../../features/get-board-view/types";
import { buildTvPages } from "../../shared/tv-pagination";
import { resolveTvStageTransform, type TvStageTransform } from "../../shared/tv-stage";
import { TvGoalProgressPage } from "./tv-goal-progress-page";
import { TvFunnelPage } from "./tv-funnel-page";
import { TvMetricFreePage } from "./tv-metric-free-page";

// Requisito explícito: a tela de TV não pode ter scroll — cada página do rodízio mostra um pedaço
// só do board (ver shared/tv-pagination.ts), grande e focado, avançando sozinha. 10s é o mesmo
// piso usado pelos slides de imagem do Broadcast Studio (DEFAULT_NEWS_BLOCK_DURATION_SECONDS-like);
// não precisa ser mais rápido que isso pra alguém conseguir ler os números.
const PAGE_DURATION_MS = 10_000;

// Mesma rede de segurança do board-canvas.tsx da versão web — SSE primário + poll de fallback.
const FALLBACK_POLL_MS = 45_000;

function useTvStageTransform(): TvStageTransform {
  const [transform, setTransform] = useState<TvStageTransform>(() => resolveTvStageTransform(0, 0));

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      setTransform(resolveTvStageTransform(window.innerWidth, window.innerHeight));
    };
    const timeoutId = setTimeout(measure, 0);
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return transform;
}

export function TvCanvas({ boardId, initialView }: { boardId: string; initialView: BoardView }) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    let cancelled = false;

    async function refetch() {
      try {
        const response = await fetch(`/api/scoreboard/boards/${boardId}/state`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as BoardView;
        if (!cancelled) setView(data);
      } catch {
        // rede instável — próximo tick de poll/evento tenta de novo
      }
    }

    let eventSource: EventSource | null = null;
    if (typeof EventSource !== "undefined") {
      try {
        eventSource = new EventSource(`/api/scoreboard/boards/${boardId}/events`);
        eventSource.onmessage = (event) => {
          const message = JSON.parse(event.data) as ScoreboardLiveEvent;
          if (message.type === "board-changed" || message.type === "reload") void refetch();
        };
      } catch {
        eventSource = null;
      }
    }

    const pollInterval = setInterval(() => void refetch(), FALLBACK_POLL_MS);

    return () => {
      cancelled = true;
      eventSource?.close();
      clearInterval(pollInterval);
    };
  }, [boardId]);

  const stage = useTvStageTransform();
  const pages = buildTvPages([...view.widgets].sort((a, b) => a.order - b.order));

  const [pageIndex, setPageIndex] = useState(0);
  // Se o número de páginas encolheu (widget removido/reduzido num sync), evita ficar apontando
  // pra um índice inexistente — volta pra última página válida em vez de estourar.
  const safePageIndex = pages.length === 0 ? 0 : Math.min(pageIndex, pages.length - 1);

  useEffect(() => {
    if (pages.length <= 1) return;
    const timeoutId = setTimeout(() => setPageIndex((current) => (current + 1) % pages.length), PAGE_DURATION_MS);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avança por tempo, não por mudança de conteúdo
  }, [safePageIndex, pages.length]);

  const currentPage = pages[safePageIndex];

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#171717", "--tv-accent": "#22C55E" } as React.CSSProperties}
    >
      <div
        className="absolute top-0 left-0 flex flex-col overflow-hidden"
        style={{
          width: `${stage.stageWidthPx}px`,
          height: `${stage.stageHeightPx}px`,
          transform: `scale(${stage.scale})`,
          transformOrigin: "top left",
        }}
      >
        <div className="flex items-center justify-between px-16 pt-10 text-white/50">
          <p className="text-xl font-medium">{view.board.name}</p>
          <p className="text-xl font-medium">{view.board.sector}</p>
        </div>

        <div className="min-h-0 flex-1 px-16 py-10">
          {!currentPage ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-3xl text-white/50">Nenhum widget publicado neste quadro ainda.</p>
            </div>
          ) : currentPage.kind === "goal_progress" ? (
            <TvGoalProgressPage title={currentPage.title} groups={currentPage.groups} />
          ) : currentPage.kind === "funnel" ? (
            <TvFunnelPage title={currentPage.title} stages={currentPage.stages} countsByGroup={currentPage.countsByGroup} />
          ) : (
            <TvMetricFreePage title={currentPage.title} items={currentPage.items} />
          )}
        </div>

        {pages.length > 1 && (
          <div className="flex flex-col gap-3 px-16 pb-10">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                key={safePageIndex}
                className="h-full rounded-full bg-(--tv-accent)"
                style={{ animation: `scoreboard-tv-progress ${PAGE_DURATION_MS}ms linear forwards` }}
              />
            </div>
            <div className="flex justify-center gap-2">
              {pages.map((page, index) => (
                <span
                  key={page.key}
                  className="h-2 w-2 rounded-full"
                  style={{ background: index === safePageIndex ? "#ffffff" : "rgba(255,255,255,0.25)" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{"@keyframes scoreboard-tv-progress { from { width: 0%; } to { width: 100%; } }"}</style>
    </div>
  );
}
