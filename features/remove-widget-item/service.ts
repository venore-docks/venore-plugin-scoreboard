import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import type { FunnelWidgetConfig, MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { applyWidgetConfig, findWidgetById } from "./store";
import type { RemoveWidgetItemCommand, RemoveWidgetItemResult } from "./types";

export async function removeWidgetItem(command: RemoveWidgetItemCommand): Promise<RemoveWidgetItemResult> {
  const widget = await findWidgetById(command.widgetId);
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
  if (widget.kind !== command.kind) {
    return {
      success: false,
      error: { code: "scoreboard.widgets.kind_mismatch", message: `Este widget é do tipo "${widget.kind}", não "${command.kind}".` },
    };
  }

  let nextConfig: Record<string, unknown>;
  if (command.kind === "funnel") {
    const config = widget.config as FunnelWidgetConfig;
    // Remove a contagem da etapa em TODOS os grupos também — deixar countsByGroup referenciando
    // uma etapa que não existe mais quebraria validateWidgetConfig na próxima edição qualquer.
    const countsByGroup: Record<string, Record<string, number>> = {};
    for (const [groupKey, counts] of Object.entries(config.countsByGroup)) {
      countsByGroup[groupKey] = Object.fromEntries(Object.entries(counts).filter(([stageKey]) => stageKey !== command.key));
    }
    nextConfig = { ...config, stages: config.stages.filter((stage) => stage.key !== command.key), countsByGroup };
  } else {
    const config = widget.config as MetricFreeWidgetConfig;
    nextConfig = { ...config, items: config.items.filter((item) => item.key !== command.key) };
  }

  const handle = beginOperation({
    useCase: "scoreboard.remove-widget-item",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const updated = await applyWidgetConfig(command.widgetId, nextConfig);

  endOperation(handle, { success: true });
  publishBoardEvent(updated.boardId, { type: "board-changed" });
  return { success: true, data: updated };
}
