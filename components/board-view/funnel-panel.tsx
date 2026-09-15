import { computeFunnelStageTotals } from "../../shared/widget-config/compute-funnel-totals";
import { UNGROUPED_KEY, type FunnelStage } from "../../shared/widget-config/types";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function FunnelPanel({
  title,
  stages,
  countsByGroup,
}: {
  title: string;
  stages: FunnelStage[];
  countsByGroup: Record<string, Record<string, number>>;
}) {
  const totals = computeFunnelStageTotals({ stages, countsByGroup });
  const groupKeys = Object.keys(countsByGroup).filter((key) => key !== UNGROUPED_KEY);
  const maxCount = Math.max(1, ...totals.map((stage) => stage.count));

  return (
    <section className="space-y-4 rounded-panel border border-border bg-card p-4 shadow-panel sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-caps text-primary">{title}</h2>

      <div className="space-y-3">
        {totals.map((stage) => (
          <div key={stage.key} className="space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{stage.label}</span>
              <span className="text-lg font-semibold tabular-nums text-foreground">{numberFormatter.format(stage.count)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(stage.count / maxCount) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {groupKeys.length > 1 && (
        // groupKey é exibido cru (não o label do grupo) — o funil só guarda a chave, o label
        // amigável vive no widget goal_progress do mesmo board (shared/widget-config/types.ts,
        // GoalProgressGroup.label). Bom o suficiente pro v1: as chaves usadas na prática (slug do
        // segmento/curso) já são legíveis.
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-caps text-muted-foreground/56">
                <th className="py-2 pr-3 font-semibold">Grupo</th>
                {stages.map((stage) => (
                  <th key={stage.key} className="px-2 py-2 text-right font-semibold tabular-nums">
                    {stage.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupKeys.map((groupKey) => (
                <tr key={groupKey} className="border-b border-border last:border-b-0">
                  <td className="py-2 pr-3 font-medium text-foreground">{groupKey}</td>
                  {stages.map((stage) => (
                    <td key={stage.key} className="px-2 py-2 text-right tabular-nums text-muted-foreground">
                      {numberFormatter.format(countsByGroup[groupKey]?.[stage.key] ?? 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
