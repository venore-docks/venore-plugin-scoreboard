import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

export type RemoveWidgetItemCommand = {
  widgetId: string;
  kind: "goal_progress" | "funnel" | "metric_free";
  key: string;
  actorId: string;
};

export type RemoveWidgetItemInput = { widgetId: string; kind: "goal_progress" | "funnel" | "metric_free"; key: string };
export type RemoveWidgetItemResult = OperationResult<WidgetRecord>;
