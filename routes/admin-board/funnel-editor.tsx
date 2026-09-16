import { UNGROUPED_KEY, type FunnelWidgetConfig } from "../../shared/widget-config/types";
import type { GroupRecord } from "../../contracts/types";
import { AddItemForm } from "./add-item-form";
import { AssignGroupForm } from "./assign-group-form";
import { InlineNumberField } from "./inline-number-field";
import { RemoveItemButton } from "./remove-item-button";
import { UnassignGroupButton } from "./unassign-group-button";

export function FunnelEditor({
  boardId,
  widgetId,
  config,
  catalog,
  readOnly,
}: {
  boardId: string;
  widgetId: string;
  config: FunnelWidgetConfig;
  catalog: GroupRecord[];
  readOnly: boolean;
}) {
  const stages = [...config.stages].sort((a, b) => a.order - b.order);
  const groupKeys = Object.keys(config.countsByGroup);
  const labelByKey = new Map(catalog.map((group) => [group.key, group.label]));
  const availableGroups = catalog.filter((group) => !groupKeys.includes(group.key)).map((group) => ({ key: group.key, label: group.label }));

  // Sem nenhum curso/segmento atribuído ainda, o funil mostra um único "Total" — bom o bastante
  // pra um board que não precisa quebrar o funil por curso. Atribuir o primeiro curso (abaixo)
  // troca esse "Total" por linhas de verdade.
  const displayRows = groupKeys.length > 0 ? groupKeys : [UNGROUPED_KEY];

  return (
    <div className="space-y-4">
      {stages.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">Nenhuma etapa ainda — adicione a primeira abaixo.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
                <th className="px-3 py-2 font-semibold">Curso/segmento</th>
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
                <th className="px-2 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {displayRows.map((groupKey) => {
                const label = groupKey === UNGROUPED_KEY ? "Total" : (labelByKey.get(groupKey) ?? groupKey);
                return (
                  <tr key={groupKey} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2 font-medium text-foreground">{label}</td>
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
                    <td className="px-2 py-2">
                      {!readOnly && groupKey !== UNGROUPED_KEY && (
                        <UnassignGroupButton boardId={boardId} widgetId={widgetId} kind="funnel" groupKey={groupKey} groupLabel={label} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!readOnly && (
        <div className="space-y-2">
          <AssignGroupForm boardId={boardId} widgetId={widgetId} kind="funnel" availableGroups={availableGroups} />
          <AddItemForm boardId={boardId} widgetId={widgetId} kind="funnel" />
        </div>
      )}
    </div>
  );
}
