import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { validateWidgetConfig } from "../../shared/widget-config/validate-widget-config";
import { applyWidgetUpdate, findWidgetById } from "./store";
import type { UpdateWidgetCommand, UpdateWidgetResult } from "./types";

export async function updateWidget(command: UpdateWidgetCommand): Promise<UpdateWidgetResult> {
  const existing = await findWidgetById(command.widgetId);
  if (!existing) {
    return { success: false, error: { code: "scoreboard.widgets.not_found", message: "Widget não encontrado." } };
  }

  if (command.config !== undefined) {
    // Widgets prime_sync só são escritos pelo processo de sync (trigger-prime-sync) — editar a
    // config manualmente aqui apagaria o espelho na próxima leitura sem avisar ninguém.
    if (existing.dataSource === "prime_sync") {
      return {
        success: false,
        error: {
          code: "scoreboard.widgets.prime_sync_readonly",
          message: "Este widget é alimentado pela sincronização com a Prime — os valores não podem ser editados manualmente.",
        },
      };
    }
    const configError = validateWidgetConfig(existing.kind, command.config);
    if (configError) {
      return { success: false, error: configError };
    }
  }

  const handle = beginOperation({
    useCase: "scoreboard.update-widget",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const widget = await applyWidgetUpdate(command.widgetId, {
    title: command.title?.trim(),
    order: command.order,
    config: command.config,
  });

  endOperation(handle, { success: true });
  publishBoardEvent(widget.boardId, { type: "board-changed" });
  return { success: true, data: widget };
}
