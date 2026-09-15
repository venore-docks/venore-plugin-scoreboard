import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

export type UpdateWidgetCommand = {
  widgetId: string;
  title?: string;
  order?: number;
  config?: Record<string, unknown>;
  actorId: string;
};

export type UpdateWidgetInput = Omit<UpdateWidgetCommand, "actorId">;
export type UpdateWidgetResult = OperationResult<WidgetRecord>;
