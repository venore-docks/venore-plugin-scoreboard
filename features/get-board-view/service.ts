import type { WidgetRecord } from "../../contracts/types";
import { summarizeGoalProgressGroup } from "../../shared/widget-config/compute-goal-progress";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig, MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { findBoardWithWidgets } from "./store";
import type { BoardView, BoardViewWidget, GetBoardViewInput, GetBoardViewResult } from "./types";

// Widget cru (config jsonb livre) -> widget calculado (percentuais/totais prontos pra render) —
// nunca duas fontes de verdade: quem consome BoardView não recalcula nada, só exibe.
function toBoardViewWidget(widget: WidgetRecord): BoardViewWidget {
  const shared = { id: widget.id, title: widget.title, order: widget.order, dataSource: widget.dataSource, lastSyncedAt: widget.lastSyncedAt };

  switch (widget.kind) {
    case "goal_progress": {
      const config = widget.config as GoalProgressWidgetConfig;
      return { ...shared, kind: "goal_progress", groups: (config.groups ?? []).map(summarizeGoalProgressGroup) };
    }
    case "funnel": {
      const config = widget.config as FunnelWidgetConfig;
      return {
        ...shared,
        kind: "funnel",
        stages: [...(config.stages ?? [])].sort((a, b) => a.order - b.order),
        countsByGroup: config.countsByGroup ?? {},
      };
    }
    case "metric_free": {
      const config = widget.config as MetricFreeWidgetConfig;
      return { ...shared, kind: "metric_free", items: config.items ?? [] };
    }
  }
}

export async function getBoardView(input: GetBoardViewInput): Promise<GetBoardViewResult> {
  const board = await findBoardWithWidgets(input.boardId);
  if (!board) {
    return { success: false, error: { code: "scoreboard.boards.not_found", message: "Quadro não encontrado." } };
  }

  const view: BoardView = {
    board: {
      id: board.id,
      slug: board.slug,
      name: board.name,
      sector: board.sector,
      description: board.description,
      order: board.order,
      published: board.published,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    },
    widgets: board.widgets.map(toBoardViewWidget),
  };
  return { success: true, data: view };
}
