// Shape de `config` (jsonb) por WidgetKind — ver contracts/types.ts (WidgetRecord.config é
// Record<string, unknown> cru; este arquivo é quem narra o formato concreto por kind).

// Usado quando o funil/config não é segmentado por grupo (ex.: metric_free, ou um board futuro
// sem segmento/curso). Erasto e Fidelis sempre segmentam por groupKey real.
export const UNGROUPED_KEY = "_all";

export type GoalProgressGroup = {
  key: string; // slug estável do grupo — segmento (Erasto) ou curso (Fidelis)
  label: string;
  // Rótulo cru esperado vindo da Prime pra este grupo (bate com prime_student_raw.rawSegmentOrCourse).
  // Ausente = usa `key`. Só relevante quando o widget é dataSource=prime_sync — SUPOSIÇÃO, sem
  // payload real da Prime ainda pra confirmar o formato.
  primeSegmentKey?: string;
  newStudentsGoal: number;
  newStudentsActual: number;
  retentionTargetPercent: number; // ex.: 93 — % de retenção alvo
  eligibleBase: number; // base de alunos elegíveis à rematrícula
  reenrolledActual: number;
};

export type GoalProgressWidgetConfig = { groups: GoalProgressGroup[] };

export type FunnelStage = { key: string; label: string; order: number };

export type FunnelWidgetConfig = {
  stages: FunnelStage[]; // etapas configuráveis (rótulo/ordem) — vocabulário livre por board
  // groupKey -> stageKey -> contagem. groupKey = UNGROUPED_KEY quando o funil não é por segmento/curso.
  countsByGroup: Record<string, Record<string, number>>;
};

export type MetricFreeItem = { key: string; label: string; value: number; unit?: string; helpText?: string };

export type MetricFreeWidgetConfig = { items: MetricFreeItem[] };

export type WidgetConfigByKind = {
  goal_progress: GoalProgressWidgetConfig;
  funnel: FunnelWidgetConfig;
  metric_free: MetricFreeWidgetConfig;
};

export type WidgetKind = keyof WidgetConfigByKind;

export const WIDGET_KINDS: WidgetKind[] = ["goal_progress", "funnel", "metric_free"];

export function emptyWidgetConfig(kind: WidgetKind): WidgetConfigByKind[WidgetKind] {
  switch (kind) {
    case "goal_progress":
      return { groups: [] };
    case "funnel":
      return { stages: [], countsByGroup: {} };
    case "metric_free":
      return { items: [] };
  }
}
