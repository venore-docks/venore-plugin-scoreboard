import { Progress } from "@venore/plugin-sdk/ui";
import type { GoalProgressGroupSummary } from "../../shared/widget-config/compute-goal-progress";

const numberFormatter = new Intl.NumberFormat("pt-BR");

function ProgressRow({ label, actual, goal, percent }: { label: string; actual: number; goal: number; percent: number | null }) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium tracking-caps uppercase text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {numberFormatter.format(actual)}
          <span className="text-muted-foreground"> / {numberFormatter.format(goal)}</span>
          {percent !== null && <span className="ml-1 text-xs text-muted-foreground">({percent}%)</span>}
        </span>
      </div>
      <Progress value={percent === null ? 0 : Math.min(percent, 100)} />
    </div>
  );
}

export function GoalProgressPanel({ title, groups }: { title: string; groups: GoalProgressGroupSummary[] }) {
  return (
    <section className="space-y-4 rounded-panel border border-border bg-card p-4 shadow-panel sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-caps text-primary">{title}</h2>
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum grupo cadastrado.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <div key={group.key} className="space-y-3 rounded-panel border border-border/60 bg-background/40 p-3">
              <p className="text-sm font-semibold text-foreground">{group.label}</p>
              <ProgressRow label="Novos" actual={group.newStudentsActual} goal={group.newStudentsGoal} percent={group.newStudentsAchievedPercent} />
              <ProgressRow
                label="Rematrícula"
                actual={group.reenrolledActual}
                goal={group.reenrollmentGoal}
                percent={group.reenrollmentAchievedPercent}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
