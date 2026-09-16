import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

export type UnassignWidgetGroupInput = { widgetId: string; kind: "goal_progress" | "funnel"; groupKey: string };
export type UnassignWidgetGroupResult = OperationResult<WidgetRecord>;
