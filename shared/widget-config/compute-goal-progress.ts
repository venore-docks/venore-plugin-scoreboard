import type { GoalProgressGroup } from "./types";

// Puro, sem I/O — usado tanto por get-board-view (render) quanto pelo formulário do admin
// (preview ao vivo), pra nunca ter duas fontes de verdade divergentes entre "o que foi salvo" e
// "o que é mostrado". Meta de rematrícula NUNCA é armazenada como número — é sempre
// eligibleBase * retentionTargetPercent recalculado na hora (decisão fechada com o usuário).
export function computeReenrollmentGoal(group: Pick<GoalProgressGroup, "eligibleBase" | "retentionTargetPercent">): number {
  return Math.round((group.eligibleBase * group.retentionTargetPercent) / 100);
}

// null quando a meta é 0 (evita divisão por zero) — a UI decide como mostrar "sem meta definida"
// nesse caso, em vez desta função inventar um valor.
export function computeAchievedPercent(actual: number, goal: number): number | null {
  if (goal <= 0) return null;
  return Math.round((actual / goal) * 1000) / 10; // uma casa decimal
}

// `label` não vem mais de dentro do GoalProgressGroup cru (isso mudou de lugar pro catálogo
// compartilhado, ver database/schema/index.ts, scoreboardGroups) — quem monta o summary precisa
// resolver e passar o label de fora (ver features/get-board-view/service.ts).
export type GoalProgressGroupSummary = GoalProgressGroup & {
  label: string;
  reenrollmentGoal: number;
  newStudentsAchievedPercent: number | null;
  reenrollmentAchievedPercent: number | null;
};

export function summarizeGoalProgressGroup(group: GoalProgressGroup, label: string): GoalProgressGroupSummary {
  const reenrollmentGoal = computeReenrollmentGoal(group);
  return {
    ...group,
    label,
    reenrollmentGoal,
    newStudentsAchievedPercent: computeAchievedPercent(group.newStudentsActual, group.newStudentsGoal),
    reenrollmentAchievedPercent: computeAchievedPercent(group.reenrolledActual, reenrollmentGoal),
  };
}
