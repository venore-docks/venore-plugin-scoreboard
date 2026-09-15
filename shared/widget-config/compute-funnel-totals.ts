import { UNGROUPED_KEY, type FunnelWidgetConfig } from "./types";

export type FunnelStageTotal = { key: string; label: string; order: number; count: number };

// Soma countsByGroup em totais por etapa, já ordenados — usado pelo painel do funil quando não
// interessa quebrar por grupo (visão consolidada do board) e pelo admin como preview.
export function computeFunnelStageTotals(config: FunnelWidgetConfig): FunnelStageTotal[] {
  return [...config.stages]
    .sort((a, b) => a.order - b.order)
    .map((stage) => ({
      key: stage.key,
      label: stage.label,
      order: stage.order,
      count: Object.values(config.countsByGroup).reduce((sum, counts) => sum + (counts[stage.key] ?? 0), 0),
    }));
}

// Contagem de um grupo específico (ou UNGROUPED_KEY quando o funil não é segmentado) — usado
// pelo painel quando o board tem groupKeys reais (ex.: um funil por segmento/curso).
export function getFunnelCountsForGroup(config: FunnelWidgetConfig, groupKey: string = UNGROUPED_KEY): Record<string, number> {
  return config.countsByGroup[groupKey] ?? {};
}
