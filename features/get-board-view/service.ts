import type { WidgetRecord } from "../../contracts/types";
import { summarizeGoalProgressGroup } from "../../shared/widget-config/compute-goal-progress";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig, MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { findBoardWithWidgets, findGroupsByKeys } from "./store";
import type { BoardView, BoardViewWidget, GetBoardViewInput, GetBoardViewResult } from "./types";

// Coleta toda key de grupo usada pelo board inteiro (goal_progress.groups[].key +
// funnel.countsByGroup) — uma única busca no catálogo pra resolver todos os labels, em vez de uma
// por widget.
function collectGroupKeys(widgets: WidgetRecord[]): Set<string> {
  const keys = new Set<string>();
  for (const widget of widgets) {
    if (widget.kind === "goal_progress") {
      for (const group of (widget.config as GoalProgressWidgetConfig).groups ?? []) keys.add(group.key);
    } else if (widget.kind === "funnel") {
      for (const key of Object.keys((widget.config as FunnelWidgetConfig).countsByGroup ?? {})) keys.add(key);
    }
  }
  return keys;
}

// Widget cru (config jsonb livre) -> widget calculado (percentuais/totais/labels prontos pra
// render) — nunca duas fontes de verdade: quem consome BoardView não recalcula nada, só exibe.
// `labelByKey` vem do catálogo compartilhado (scoreboardGroups) — fallback pra própria key se o
// catálogo não tiver (não deveria acontecer, delete-group bloqueia enquanto em uso, mas nunca
// quebra o render).
function toBoardViewWidget(widget: WidgetRecord, labelByKey: Map<string, string>): BoardViewWidget {
  const shared = { id: widget.id, title: widget.title, order: widget.order, dataSource: widget.dataSource, lastSyncedAt: widget.lastSyncedAt };

  switch (widget.kind) {
    case "goal_progress": {
      const config = widget.config as GoalProgressWidgetConfig;
      return {
        ...shared,
        kind: "goal_progress",
        groups: (config.groups ?? []).map((group) => summarizeGoalProgressGroup(group, labelByKey.get(group.key) ?? group.key)),
      };
    }
    case "funnel": {
      const config = widget.config as FunnelWidgetConfig;
      const countsByGroup = config.countsByGroup ?? {};
      const groupLabels: Record<string, string> = {};
      for (const key of Object.keys(countsByGroup)) groupLabels[key] = labelByKey.get(key) ?? key;
      return {
        ...shared,
        kind: "funnel",
        stages: [...(config.stages ?? [])].sort((a, b) => a.order - b.order),
        countsByGroup,
        groupLabels,
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

  const groupKeys = [...collectGroupKeys(board.widgets)];
  const groups = await findGroupsByKeys(groupKeys);
  const labelByKey = new Map(groups.map((group) => [group.key, group.label]));

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
    widgets: board.widgets.map((widget) => toBoardViewWidget(widget, labelByKey)),
  };
  return { success: true, data: view };
}
