import type { OperationResult } from "@venore/plugin-sdk";
import type { BoardRecord, WidgetDataSource } from "../../contracts/types";
import type { GoalProgressGroupSummary } from "../../shared/widget-config/compute-goal-progress";
import type { FunnelStage, MetricFreeItem } from "../../shared/widget-config/types";

export type BoardViewWidget =
  | {
      id: string;
      kind: "goal_progress";
      title: string;
      order: number;
      dataSource: WidgetDataSource;
      lastSyncedAt: Date | null;
      groups: GoalProgressGroupSummary[];
    }
  | {
      id: string;
      kind: "funnel";
      title: string;
      order: number;
      dataSource: WidgetDataSource;
      lastSyncedAt: Date | null;
      stages: FunnelStage[];
      countsByGroup: Record<string, Record<string, number>>;
      // Label do catálogo compartilhado (database/schema/index.ts, scoreboardGroups) por groupKey
      // usado em countsByGroup — resolvido em service.ts. Ausência (grupo apagado por fora, não
      // deveria acontecer dado o bloqueio de delete) cai no fallback da própria key no consumidor.
      groupLabels: Record<string, string>;
    }
  | {
      id: string;
      kind: "metric_free";
      title: string;
      order: number;
      dataSource: WidgetDataSource;
      lastSyncedAt: Date | null;
      items: MetricFreeItem[];
    };

export type BoardView = { board: Omit<BoardRecord, "createdByUserId">; widgets: BoardViewWidget[] };

export type GetBoardViewInput = { boardId: string };
export type GetBoardViewResult = OperationResult<BoardView>;
