import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { validateWidgetConfig } from "../../shared/widget-config/validate-widget-config";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig } from "../../shared/widget-config/types";
import { applyWidgetConfig, findGroupByKey, findWidgetById } from "./store";
import type { AssignWidgetGroupCommand, AssignWidgetGroupResult } from "./types";

export async function assignWidgetGroup(command: AssignWidgetGroupCommand): Promise<AssignWidgetGroupResult> {
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

  const group = await findGroupByKey(command.groupKey);
  if (!group) {
    return { success: false, error: { code: "scoreboard.groups.not_found", message: "Curso/segmento não encontrado no catálogo." } };
  }

  let nextConfig: Record<string, unknown>;
  if (command.kind === "goal_progress") {
    const config = widget.config as GoalProgressWidgetConfig;
    if (config.groups.some((existing) => existing.key === command.groupKey)) {
      return {
        success: false,
        error: { code: "scoreboard.widgets.group_already_assigned", message: `"${group.label}" já está atribuído a este widget.` },
      };
    }
    nextConfig = {
      ...config,
      groups: [
        ...config.groups,
        { key: command.groupKey, newStudentsGoal: 0, newStudentsActual: 0, retentionTargetPercent: 93, eligibleBase: 0, reenrolledActual: 0 },
      ],
    };
  } else {
    const config = widget.config as FunnelWidgetConfig;
    if (Object.prototype.hasOwnProperty.call(config.countsByGroup, command.groupKey)) {
      return {
        success: false,
        error: { code: "scoreboard.widgets.group_already_assigned", message: `"${group.label}" já está atribuído a este widget.` },
      };
    }
    // Materializa a entrada vazia — sem isso o groupKey só apareceria na tabela do funil depois do
    // primeiro valor lançado (set-widget-manual-value), o que pareceria "atribuir não fez nada".
    nextConfig = { ...config, countsByGroup: { ...config.countsByGroup, [command.groupKey]: {} } };
  }

  const configError = validateWidgetConfig(command.kind, nextConfig);
  if (configError) {
    return { success: false, error: configError };
  }

  const handle = beginOperation({
    useCase: "scoreboard.assign-widget-group",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const updated = await applyWidgetConfig(command.widgetId, nextConfig);

  endOperation(handle, { success: true });
  publishBoardEvent(updated.boardId, { type: "board-changed" });
  return { success: true, data: updated };
}
