import type { MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { InlineNumberField } from "./inline-number-field";

export function MetricFreeEditor({
  boardId,
  widgetId,
  config,
  readOnly,
}: {
  boardId: string;
  widgetId: string;
  config: MetricFreeWidgetConfig;
  readOnly: boolean;
}) {
  if (config.items.length === 0) {
    return <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum item ainda — adicione pela estrutura (JSON) abaixo.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {config.items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-3 rounded-panel border border-border/60 bg-background/40 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
            {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
          </div>
          <InlineNumberField
            boardId={boardId}
            widgetId={widgetId}
            kind="metric_free"
            hidden={{ itemKey: item.key }}
            value={item.value}
            disabled={readOnly}
          />
        </div>
      ))}
    </div>
  );
}
