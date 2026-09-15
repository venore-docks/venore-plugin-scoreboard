import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig, MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { applyWidgetConfig, findWidgetById } from "./store";
import type { SetWidgetManualValueCommand, SetWidgetManualValueResult } from "./types";

function patchGoalProgress(config: GoalProgressWidgetConfig, groupKey: string, field: string, value: number): GoalProgressWidgetConfig | null {
  const groupIndex = config.groups.findIndex((group) => group.key === groupKey);
  if (groupIndex === -1) return null;
  const groups = [...config.groups];
  groups[groupIndex] = { ...groups[groupIndex], [field]: value };
  return { ...config, groups };
}

function patchFunnel(config: FunnelWidgetConfig, groupKey: string, stageKey: string, value: number): FunnelWidgetConfig | null {
  if (!config.stages.some((stage) => stage.key === stageKey)) return null;
  return {
    ...config,
    countsByGroup: { ...config.countsByGroup, [groupKey]: { ...(config.countsByGroup[groupKey] ?? {}), [stageKey]: value } },
  };
}

function patchMetricFree(config: MetricFreeWidgetConfig, itemKey: string, value: number): MetricFreeWidgetConfig | null {
  const itemIndex = config.items.findIndex((item) => item.key === itemKey);
  if (itemIndex === -1) return null;
  const items = [...config.items];
  items[itemIndex] = { ...items[itemIndex], value };
  return { ...config, items };
}

export async function setWidgetManualValue(command: SetWidgetManualValueCommand): Promise<SetWidgetManualValueResult> {
  const widget = await findWidgetById(command.widgetId);
  if (!widget) {
    return { success: false, error: { code: "scoreboard.widgets.not_found", message: "Widget não encontrado." } };
  }
  if (widget.dataSource === "prime_sync") {
    return {
      success: false,
      error: {
        code: "scoreboard.widgets.prime_sync_readonly",
        message: "Este widget é alimentado pela sincronização com a Prime — os valores não podem ser editados manualmente.",
      },
    };
  }
  if (widget.kind !== command.kind) {
    return {
      success: false,
      error: { code: "scoreboard.widgets.kind_mismatch", message: `Este widget é do tipo "${widget.kind}", não "${command.kind}".` },
    };
  }

  let nextConfig: Record<string, unknown> | null;
  switch (command.kind) {
    case "goal_progress":
      nextConfig = patchGoalProgress(widget.config as GoalProgressWidgetConfig, command.groupKey, command.field, command.value);
      break;
    case "funnel":
      nextConfig = patchFunnel(widget.config as FunnelWidgetConfig, command.groupKey, command.stageKey, command.value);
      break;
    case "metric_free":
      nextConfig = patchMetricFree(widget.config as MetricFreeWidgetConfig, command.itemKey, command.value);
      break;
  }

  if (!nextConfig) {
    return { success: false, error: { code: "scoreboard.widgets.target_not_found", message: "O grupo/etapa/item informado não existe neste widget." } };
  }

  const handle = beginOperation({
    useCase: "scoreboard.set-widget-manual-value",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const updated = await applyWidgetConfig(command.widgetId, nextConfig);

  endOperation(handle, { success: true });
  publishBoardEvent(updated.boardId, { type: "board-changed" });
  return { success: true, data: updated };
}
