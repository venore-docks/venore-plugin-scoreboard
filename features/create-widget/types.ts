import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetDataSource, WidgetKind, WidgetRecord } from "../../contracts/types";

export type CreateWidgetCommand = {
  boardId: string;
  kind: WidgetKind;
  title: string;
  dataSource?: WidgetDataSource;
  config: Record<string, unknown>;
  actorId: string;
};

export type CreateWidgetInput = Omit<CreateWidgetCommand, "actorId">;
export type CreateWidgetResult = OperationResult<WidgetRecord>;
