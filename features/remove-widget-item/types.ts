import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

// Só funnel (etapa) e metric_free (item) — remover um grupo de goal_progress/funnel agora é
// features/unassign-widget-group (o grupo em si vive no catálogo compartilhado, não é apagado por
// aqui).
export type RemoveWidgetItemCommand = { widgetId: string; kind: "funnel" | "metric_free"; key: string; actorId: string };
export type RemoveWidgetItemInput = { widgetId: string; kind: "funnel" | "metric_free"; key: string };
export type RemoveWidgetItemResult = OperationResult<WidgetRecord>;
