import { publishBoardEvent } from "../../runtime/board-bus";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig } from "../../shared/widget-config/types";
import { applyWidgetConfig, findWidgetById } from "./store";
import type { UnassignWidgetGroupInput, UnassignWidgetGroupResult } from "./types";

// Só solta a referência DESTE widget — o curso continua existindo no catálogo (e em qualquer
// outro widget/board que também o use). Apagar o curso de vez é features/delete-group.
export async function unassignWidgetGroup(input: UnassignWidgetGroupInput): Promise<UnassignWidgetGroupResult> {
  const widget = await findWidgetById(input.widgetId);
  if (!widget) {
    return { success: false, error: { code: "scoreboard.widgets.not_found", message: "Widget não encontrado." } };
  }
  if (widget.dataSource === "prime_sync") {
    return {
      success: false,
      error: {
        code: "scoreboard.widgets.prime_sync_readonly",
        message: "Este widget é alimentado pela sincronização com a Prime — a estrutura não pode ser editada manualmente.",
      },
    };
  }
  if (widget.kind !== input.kind) {
    return {
      success: false,
      error: { code: "scoreboard.widgets.kind_mismatch", message: `Este widget é do tipo "${widget.kind}", não "${input.kind}".` },
    };
  }

  let nextConfig: Record<string, unknown>;
  if (input.kind === "goal_progress") {
    const config = widget.config as GoalProgressWidgetConfig;
    nextConfig = { ...config, groups: config.groups.filter((group) => group.key !== input.groupKey) };
  } else {
    const config = widget.config as FunnelWidgetConfig;
    const countsByGroup = { ...config.countsByGroup };
    delete countsByGroup[input.groupKey];
    nextConfig = { ...config, countsByGroup };
  }

  const updated = await applyWidgetConfig(input.widgetId, nextConfig);
  publishBoardEvent(updated.boardId, { type: "board-changed" });
  return { success: true, data: updated };
}
