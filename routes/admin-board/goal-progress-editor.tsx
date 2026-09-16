import { computeReenrollmentGoal } from "../../shared/widget-config/compute-goal-progress";
import type { GoalProgressWidgetConfig } from "../../shared/widget-config/types";
import { AddItemForm } from "./add-item-form";
import { InlineNumberField } from "./inline-number-field";
import { RemoveItemButton } from "./remove-item-button";

export function GoalProgressEditor({
  boardId,
  widgetId,
  config,
  readOnly,
}: {
  boardId: string;
  widgetId: string;
  config: GoalProgressWidgetConfig;
  readOnly: boolean;
}) {
  return (
    <div className="space-y-3">
      {config.groups.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">Nenhum grupo ainda — adicione o primeiro abaixo.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
                <th className="px-3 py-2 font-semibold">Grupo</th>
                <th className="px-2 py-2 text-right font-semibold">Meta novos</th>
                <th className="px-2 py-2 text-right font-semibold">Novos atual</th>
                <th className="px-2 py-2 text-right font-semibold">% retenção</th>
                <th className="px-2 py-2 text-right font-semibold">Base elegível</th>
                <th className="px-2 py-2 text-right font-semibold">Meta rematrícula</th>
                <th className="px-2 py-2 text-right font-semibold">Rematrícula atual</th>
                <th className="px-2 py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {config.groups.map((group) => (
                <tr key={group.key} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-medium text-foreground">{group.label}</td>
                  <td className="px-2 py-2 text-right">
                    <InlineNumberField
                      boardId={boardId}
                      widgetId={widgetId}
                      kind="goal_progress"
                      hidden={{ groupKey: group.key, field: "newStudentsGoal" }}
                      value={group.newStudentsGoal}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="px-2 py-2 text-right">
                    <InlineNumberField
                      boardId={boardId}
                      widgetId={widgetId}
                      kind="goal_progress"
                      hidden={{ groupKey: group.key, field: "newStudentsActual" }}
                      value={group.newStudentsActual}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="px-2 py-2 text-right">
                    <InlineNumberField
                      boardId={boardId}
                      widgetId={widgetId}
                      kind="goal_progress"
                      hidden={{ groupKey: group.key, field: "retentionTargetPercent" }}
                      value={group.retentionTargetPercent}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="px-2 py-2 text-right">
                    <InlineNumberField
                      boardId={boardId}
                      widgetId={widgetId}
                      kind="goal_progress"
                      hidden={{ groupKey: group.key, field: "eligibleBase" }}
                      value={group.eligibleBase}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-muted-foreground">{computeReenrollmentGoal(group)}</td>
                  <td className="px-2 py-2 text-right">
                    <InlineNumberField
                      boardId={boardId}
                      widgetId={widgetId}
                      kind="goal_progress"
                      hidden={{ groupKey: group.key, field: "reenrolledActual" }}
                      value={group.reenrolledActual}
                      disabled={readOnly}
                    />
                  </td>
                  <td className="px-2 py-2">
                    {!readOnly && (
                      <RemoveItemButton boardId={boardId} widgetId={widgetId} kind="goal_progress" itemKey={group.key} itemLabel={group.label} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!readOnly && <AddItemForm boardId={boardId} widgetId={widgetId} kind="goal_progress" />}
    </div>
  );
}
