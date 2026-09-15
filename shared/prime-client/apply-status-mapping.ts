import { UNGROUPED_KEY } from "../widget-config/types";
import type { PrimeStudentDTO } from "./types";

export type PrimeGroupResolution = { groupKey: string; primeSegmentKey: string };

// Puro, sem I/O — testável isoladamente do fetch real da Prime. Traduz o snapshot cru (staging)
// pra contagens por etapa/grupo, usando o mapeamento status->etapa e a resolução grupo->segmento
// cadastrados no admin daquele board (nunca hardcoded em código, ver database/schema/index.ts,
// prime_status_mapping).
export type ApplyStatusMappingResult = {
  funnelCountsByGroup: Record<string, Record<string, number>>;
  // Contagem de alunos na etapa terminal (maior `order` do funil) por grupo e tipo — é o que
  // alimenta goal_progress.newStudentsActual/reenrolledActual quando o widget é prime_sync.
  // SUPOSIÇÃO: "meta atingida" = aluno chegou na etapa final do funil daquele board; não há
  // confirmação da Prime sobre outra definição de "matriculado" ainda.
  terminalCountsByGroup: Record<string, { new: number; reenrollment: number }>;
  unmappedStatuses: string[];
  unmappedSegments: string[];
};

export function applyStatusMapping(params: {
  students: PrimeStudentDTO[];
  statusMapping: Array<{ rawStatus: string; stageKey: string }>;
  groups: PrimeGroupResolution[];
  terminalStageKey: string | null;
}): ApplyStatusMappingResult {
  const { students, statusMapping, groups, terminalStageKey } = params;

  const stageByRawStatus = new Map(statusMapping.map((entry) => [entry.rawStatus, entry.stageKey]));
  const groupByPrimeSegment = new Map(groups.map((group) => [group.primeSegmentKey, group.groupKey]));

  const funnelCountsByGroup: Record<string, Record<string, number>> = {};
  const terminalCountsByGroup: Record<string, { new: number; reenrollment: number }> = {};
  const unmappedStatuses = new Set<string>();
  const unmappedSegments = new Set<string>();

  for (const student of students) {
    const stageKey = stageByRawStatus.get(student.rawStatus);
    if (!stageKey) {
      unmappedStatuses.add(student.rawStatus);
      continue;
    }

    const groupKey = groupByPrimeSegment.get(student.segmentOrCourse) ?? (groups.length === 0 ? UNGROUPED_KEY : undefined);
    if (!groupKey) {
      unmappedSegments.add(student.segmentOrCourse);
      continue;
    }

    const counts = funnelCountsByGroup[groupKey] ?? {};
    counts[stageKey] = (counts[stageKey] ?? 0) + 1;
    funnelCountsByGroup[groupKey] = counts;

    if (terminalStageKey && stageKey === terminalStageKey) {
      const terminal = terminalCountsByGroup[groupKey] ?? { new: 0, reenrollment: 0 };
      terminal[student.enrollmentType] += 1;
      terminalCountsByGroup[groupKey] = terminal;
    }
  }

  return {
    funnelCountsByGroup,
    terminalCountsByGroup,
    unmappedStatuses: [...unmappedStatuses],
    unmappedSegments: [...unmappedSegments],
  };
}
