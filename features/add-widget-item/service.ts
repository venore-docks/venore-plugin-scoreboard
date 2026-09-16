import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { slugify } from "../../shared/slug";
import { validateWidgetConfig } from "../../shared/widget-config/validate-widget-config";
import type { FunnelWidgetConfig, MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { applyWidgetConfig, findWidgetById } from "./store";
import type { AddWidgetItemCommand, AddWidgetItemResult } from "./types";

// Deriva uma key única a partir do rótulo — ganha sufixo numérico só se colidir com uma já
// existente na lista (mesmo racional de generateUniqueSlug em features/create-board/service.ts,
// só que sobre um array em memória em vez de uma consulta ao banco).
function generateUniqueKey(label: string, existingKeys: Set<string>): string {
  const root = slugify(label) || "item";
  let candidate = root;
  let attempt = 1;
  while (existingKeys.has(candidate)) {
    attempt += 1;
    candidate = `${root}-${attempt}`;
  }
  return candidate;
}

export async function addWidgetItem(command: AddWidgetItemCommand): Promise<AddWidgetItemResult> {
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
    const key = generateUniqueKey(command.label, new Set(config.stages.map((stage) => stage.key)));
    const nextOrder = config.stages.length === 0 ? 0 : Math.max(...config.stages.map((stage) => stage.order)) + 1;
    nextConfig = { ...config, stages: [...config.stages, { key, label: command.label.trim(), order: nextOrder }] };
  } else {
    const config = widget.config as MetricFreeWidgetConfig;
    const key = generateUniqueKey(command.label, new Set(config.items.map((item) => item.key)));
    nextConfig = { ...config, items: [...config.items, { key, label: command.label.trim(), value: 0, unit: command.unit?.trim() || undefined }] };
  }

  const configError = validateWidgetConfig(command.kind, nextConfig);
  if (configError) {
    return { success: false, error: configError };
  }

  const handle = beginOperation({
    useCase: "scoreboard.add-widget-item",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const updated = await applyWidgetConfig(command.widgetId, nextConfig);

  endOperation(handle, { success: true });
  publishBoardEvent(updated.boardId, { type: "board-changed" });
  return { success: true, data: updated };
}
