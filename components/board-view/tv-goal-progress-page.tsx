import type { GoalProgressGroupSummary } from "../../shared/widget-config/compute-goal-progress";

const numberFormatter = new Intl.NumberFormat("pt-BR");

function TvProgressRow({ label, actual, goal, percent }: { label: string; actual: number; goal: number; percent: number | null }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[1.15rem] font-semibold uppercase tracking-wide text-white/70">{label}</span>
        <span className="text-3xl font-bold tabular-nums text-white">
          {numberFormatter.format(actual)}
          <span className="text-white/50"> / {numberFormatter.format(goal)}</span>
        </span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-(--tv-accent)"
          style={{ width: `${percent === null ? 0 : Math.min(percent, 100)}%` }}
        />
      </div>
      {percent !== null && <p className="text-right text-xl font-bold tabular-nums text-(--tv-accent)">{percent}%</p>}
    </div>
  );
}

function GroupCard({ group }: { group: GoalProgressGroupSummary }) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-white/8 p-8">
      <p className="text-2xl font-bold text-white">{group.label}</p>
      <TvProgressRow label="Novos" actual={group.newStudentsActual} goal={group.newStudentsGoal} percent={group.newStudentsAchievedPercent} />
      <TvProgressRow
        label="Rematrícula"
        actual={group.reenrolledActual}
        goal={group.reenrollmentGoal}
        percent={group.reenrollmentAchievedPercent}
      />
    </div>
  );
}

// Grade 2x2 (no máximo 4 grupos por página, ver shared/tv-pagination.ts) — cabe folgado num palco
// 1920x1080 com tipografia grande, sem precisar de scroll.
export function TvGoalProgressPage({ title, groups }: { title: string; groups: GoalProgressGroupSummary[] }) {
  return (
    <div className="flex h-full flex-col gap-8">
      <h1 className="text-5xl font-extrabold text-white">{title}</h1>
      {groups.length === 0 ? (
        <p className="text-2xl text-white/60">Nenhum grupo cadastrado ainda.</p>
      ) : (
        <div className="grid flex-1 grid-cols-2 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.key} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
