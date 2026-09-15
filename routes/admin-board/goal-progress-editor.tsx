import { computeReenrollmentGoal } from "../../shared/widget-config/compute-goal-progress";
import type { GoalProgressWidgetConfig } from "../../shared/widget-config/types";
import { InlineNumberField } from "./inline-number-field";

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
  if (config.groups.length === 0) {
    return <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum grupo ainda — adicione pela estrutura (JSON) abaixo.</p>;
  }

  return (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
