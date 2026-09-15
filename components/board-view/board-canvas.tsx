"use client";

import { useEffect, useState } from "react";
import type { ScoreboardLiveEvent } from "../../contracts/types";
import type { BoardView } from "../../features/get-board-view/types";
import { GoalProgressPanel } from "./goal-progress-panel";
import { FunnelPanel } from "./funnel-panel";
import { MetricFreePanel } from "./metric-free-panel";

// Fallback sempre ativo, além do SSE — mesmo racional de venore-plugin-broadcast/components/
// output/output-canvas.tsx: rede de segurança contra um proxy de LAN derrubando a conexão SSE em
// silêncio. Um board muda algumas vezes por dia (edição manual ou sync), então 45s é folgado o
// bastante pra nunca ser o caminho principal de atualização — o evento via SSE é.
const FALLBACK_POLL_MS = 45_000;

export function BoardCanvas({ boardId, initialView }: { boardId: string; initialView: BoardView }) {
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
        // Rede instável — o próximo tick de poll ou evento tenta de novo.
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

  const orderedWidgets = [...view.widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {orderedWidgets.map((widget) => {
        switch (widget.kind) {
          case "goal_progress":
            return <GoalProgressPanel key={widget.id} title={widget.title} groups={widget.groups} />;
          case "funnel":
            return <FunnelPanel key={widget.id} title={widget.title} stages={widget.stages} countsByGroup={widget.countsByGroup} />;
          case "metric_free":
            return <MetricFreePanel key={widget.id} title={widget.title} items={widget.items} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
