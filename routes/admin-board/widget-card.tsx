import { Badge } from "@venore/plugin-sdk/ui";
import type { WidgetRecord } from "../../contracts/types";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig, MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { GoalProgressEditor } from "./goal-progress-editor";
import { FunnelEditor } from "./funnel-editor";
import { MetricFreeEditor } from "./metric-free-editor";
import { DeleteWidgetButton } from "./delete-widget-button";

const KIND_LABELS: Record<WidgetRecord["kind"], string> = {
  goal_progress: "Meta com % atingido",
  funnel: "Funil de etapas",
  metric_free: "Métrica livre",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function WidgetCard({ boardId, widget }: { boardId: string; widget: WidgetRecord }) {
  const readOnly = widget.dataSource === "prime_sync";

  return (
    <div className="space-y-3 rounded-panel border border-border bg-card shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{widget.title}</p>
          <Badge variant="outline" className="text-[10px]">
            {KIND_LABELS[widget.kind]}
          </Badge>
          {readOnly && (
            <Badge variant="secondary" className="text-[10px]">
              Prime sync{widget.lastSyncedAt ? ` · ${dateFormatter.format(widget.lastSyncedAt)}` : " · nunca sincronizado"}
            </Badge>
          )}
        </div>
        <DeleteWidgetButton boardId={boardId} widgetId={widget.id} widgetTitle={widget.title} />
      </div>

      <div className="px-4 pb-4">
        {widget.kind === "goal_progress" && (
          <GoalProgressEditor boardId={boardId} widgetId={widget.id} config={widget.config as GoalProgressWidgetConfig} readOnly={readOnly} />
        )}
        {widget.kind === "funnel" && (
          <FunnelEditor boardId={boardId} widgetId={widget.id} config={widget.config as FunnelWidgetConfig} readOnly={readOnly} />
        )}
        {widget.kind === "metric_free" && (
          <MetricFreeEditor boardId={boardId} widgetId={widget.id} config={widget.config as MetricFreeWidgetConfig} readOnly={readOnly} />
        )}
      </div>
    </div>
  );
}
