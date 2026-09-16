import { UNGROUPED_KEY, type FunnelWidgetConfig } from "../../shared/widget-config/types";
import { AddItemForm } from "./add-item-form";
import { InlineNumberField } from "./inline-number-field";
import { RemoveItemButton } from "./remove-item-button";

export function FunnelEditor({
  boardId,
  widgetId,
  config,
  readOnly,
}: {
  boardId: string;
  widgetId: string;
  config: FunnelWidgetConfig;
  readOnly: boolean;
}) {
  const stages = [...config.stages].sort((a, b) => a.order - b.order);
  const groupKeys = Object.keys(config.countsByGroup).length > 0 ? Object.keys(config.countsByGroup) : [UNGROUPED_KEY];

  return (
    <div className="space-y-3">
      {stages.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">Nenhuma etapa ainda — adicione a primeira abaixo.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
                <th className="px-3 py-2 font-semibold">Grupo</th>
                {stages.map((stage) => (
                  <th key={stage.key} className="px-2 py-2 text-right font-semibold">
                    <span className="inline-flex items-center gap-1">
                      {stage.label}
                      {!readOnly && (
                        <RemoveItemButton boardId={boardId} widgetId={widgetId} kind="funnel" itemKey={stage.key} itemLabel={stage.label} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupKeys.map((groupKey) => (
                <tr key={groupKey} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-medium text-foreground">{groupKey === UNGROUPED_KEY ? "Total" : groupKey}</td>
                  {stages.map((stage) => (
                    <td key={stage.key} className="px-2 py-2 text-right">
                      <InlineNumberField
                        boardId={boardId}
                        widgetId={widgetId}
                        kind="funnel"
                        hidden={{ groupKey, stageKey: stage.key }}
                        value={config.countsByGroup[groupKey]?.[stage.key] ?? 0}
                        disabled={readOnly}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!readOnly && <AddItemForm boardId={boardId} widgetId={widgetId} kind="funnel" />}
    </div>
  );
}
