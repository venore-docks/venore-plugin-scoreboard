import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteWidgetInput = { widgetId: string };
export type DeleteWidgetResult = OperationResult<{ id: string; boardId: string }>;
