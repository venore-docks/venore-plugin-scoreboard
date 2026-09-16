import type { MetricFreeWidgetConfig } from "../../shared/widget-config/types";
import { AddItemForm } from "./add-item-form";
import { InlineNumberField } from "./inline-number-field";
import { RemoveItemButton } from "./remove-item-button";

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
  return (
    <div className="space-y-3">
      {config.items.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">Nenhum item ainda — adicione o primeiro abaixo.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {config.items.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3 rounded-panel border border-border/60 bg-background/40 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
              </div>
              <div className="flex items-center gap-1">
                <InlineNumberField
                  boardId={boardId}
                  widgetId={widgetId}
                  kind="metric_free"
                  hidden={{ itemKey: item.key }}
                  value={item.value}
                  disabled={readOnly}
                />
                {!readOnly && (
                  <RemoveItemButton boardId={boardId} widgetId={widgetId} kind="metric_free" itemKey={item.key} itemLabel={item.label} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!readOnly && <AddItemForm boardId={boardId} widgetId={widgetId} kind="metric_free" />}
    </div>
  );
}
