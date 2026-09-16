import { computeFunnelStageTotals } from "../../shared/widget-config/compute-funnel-totals";
import type { FunnelStage } from "../../shared/widget-config/types";

const numberFormatter = new Intl.NumberFormat("pt-BR");

export function TvFunnelPage({
  title,
  stages,
  countsByGroup,
}: {
  title: string;
  stages: FunnelStage[];
  countsByGroup: Record<string, Record<string, number>>;
}) {
  const totals = computeFunnelStageTotals({ stages, countsByGroup });
  const maxCount = Math.max(1, ...totals.map((stage) => stage.count));

  return (
    <div className="flex h-full flex-col gap-10">
      <h1 className="text-5xl font-extrabold text-white">{title}</h1>
      {totals.length === 0 ? (
        <p className="text-2xl text-white/60">Nenhuma etapa cadastrada ainda.</p>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-8">
          {totals.map((stage) => (
            <div key={stage.key} className="space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-3xl font-semibold text-white">{stage.label}</span>
                <span className="text-5xl font-extrabold tabular-nums text-white">{numberFormatter.format(stage.count)}</span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-(--tv-accent)" style={{ width: `${(stage.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
