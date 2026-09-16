import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

// Só goal_progress/funnel referenciam o catálogo compartilhado — metric_free continua usando
// features/add-widget-item (texto livre, não é um "curso").
export type AssignWidgetGroupCommand = { widgetId: string; kind: "goal_progress" | "funnel"; groupKey: string; actorId: string };
export type AssignWidgetGroupInput = { widgetId: string; kind: "goal_progress" | "funnel"; groupKey: string };
export type AssignWidgetGroupResult = OperationResult<WidgetRecord>;
