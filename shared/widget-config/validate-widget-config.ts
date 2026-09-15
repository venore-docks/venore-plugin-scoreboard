import type {
  FunnelWidgetConfig,
  GoalProgressWidgetConfig,
  MetricFreeWidgetConfig,
  WidgetConfigByKind,
  WidgetKind,
} from "./types";

export type WidgetConfigValidationError = { code: string; message: string };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// Única fonte de validação estrutural do `config` jsonb — dispatch por kind, reusada por
// create-widget/update-widget/set-widget-manual-value. O CHECK do banco só garante que `kind` é
// um dos três valores; o formato interno do jsonb é responsabilidade só daqui.
export function validateWidgetConfig(kind: WidgetKind, config: unknown): WidgetConfigValidationError | null {
  if (typeof config !== "object" || config === null) {
    return { code: "scoreboard.invalid_config", message: "A configuração do widget precisa ser um objeto." };
  }

  switch (kind) {
    case "goal_progress":
      return validateGoalProgressConfig(config as Partial<GoalProgressWidgetConfig>);
    case "funnel":
      return validateFunnelConfig(config as Partial<FunnelWidgetConfig>);
    case "metric_free":
      return validateMetricFreeConfig(config as Partial<MetricFreeWidgetConfig>);
  }
}

function validateGoalProgressConfig(config: Partial<GoalProgressWidgetConfig>): WidgetConfigValidationError | null {
  if (!Array.isArray(config.groups)) {
    return { code: "scoreboard.goal_progress.groups_required", message: "Informe ao menos a lista de grupos (mesmo vazia)." };
  }

  const seenKeys = new Set<string>();
  for (const group of config.groups) {
    if (!isNonEmptyString(group?.key) || !isNonEmptyString(group?.label)) {
      return { code: "scoreboard.goal_progress.invalid_group", message: "Cada grupo precisa de key e label." };
    }
    if (seenKeys.has(group.key)) {
      return { code: "scoreboard.goal_progress.duplicate_group_key", message: `A chave de grupo "${group.key}" está repetida.` };
    }
    seenKeys.add(group.key);

    const numericFields: (keyof typeof group)[] = [
      "newStudentsGoal",
      "newStudentsActual",
      "retentionTargetPercent",
      "eligibleBase",
      "reenrolledActual",
    ];
    for (const field of numericFields) {
      if (!isFiniteNumber(group[field]) || (group[field] as number) < 0) {
        return {
          code: "scoreboard.goal_progress.invalid_number",
          message: `O campo "${field}" do grupo "${group.key}" precisa ser um número maior ou igual a zero.`,
        };
      }
    }
    if ((group.retentionTargetPercent as number) > 100) {
      return {
        code: "scoreboard.goal_progress.invalid_percent",
        message: `O percentual de retenção do grupo "${group.key}" não pode passar de 100.`,
      };
    }
  }

  return null;
}

function validateFunnelConfig(config: Partial<FunnelWidgetConfig>): WidgetConfigValidationError | null {
  if (!Array.isArray(config.stages)) {
    return { code: "scoreboard.funnel.stages_required", message: "Informe ao menos a lista de etapas (mesmo vazia)." };
  }

  const seenKeys = new Set<string>();
  for (const stage of config.stages) {
    if (!isNonEmptyString(stage?.key) || !isNonEmptyString(stage?.label) || !isFiniteNumber(stage?.order)) {
      return { code: "scoreboard.funnel.invalid_stage", message: "Cada etapa precisa de key, label e order." };
    }
    if (seenKeys.has(stage.key)) {
      return { code: "scoreboard.funnel.duplicate_stage_key", message: `A chave de etapa "${stage.key}" está repetida.` };
    }
    seenKeys.add(stage.key);
  }

  const countsByGroup = config.countsByGroup ?? {};
  if (typeof countsByGroup !== "object" || countsByGroup === null || Array.isArray(countsByGroup)) {
    return { code: "scoreboard.funnel.invalid_counts", message: "countsByGroup precisa ser um objeto." };
  }
  for (const counts of Object.values(countsByGroup)) {
    if (typeof counts !== "object" || counts === null || Array.isArray(counts)) {
      return { code: "scoreboard.funnel.invalid_counts", message: "Cada entrada de countsByGroup precisa ser um objeto." };
    }
    for (const [stageKey, value] of Object.entries(counts as Record<string, unknown>)) {
      if (!seenKeys.has(stageKey)) {
        return {
          code: "scoreboard.funnel.unknown_stage_key",
          message: `A contagem referencia a etapa "${stageKey}", que não existe na lista de etapas.`,
        };
      }
      if (!isFiniteNumber(value) || value < 0) {
        return { code: "scoreboard.funnel.invalid_count_value", message: `A contagem da etapa "${stageKey}" precisa ser um número maior ou igual a zero.` };
      }
    }
  }

  return null;
}

function validateMetricFreeConfig(config: Partial<MetricFreeWidgetConfig>): WidgetConfigValidationError | null {
  if (!Array.isArray(config.items)) {
    return { code: "scoreboard.metric_free.items_required", message: "Informe ao menos a lista de itens (mesmo vazia)." };
  }

  const seenKeys = new Set<string>();
  for (const item of config.items) {
    if (!isNonEmptyString(item?.key) || !isNonEmptyString(item?.label) || !isFiniteNumber(item?.value)) {
      return { code: "scoreboard.metric_free.invalid_item", message: "Cada item precisa de key, label e value." };
    }
    if (seenKeys.has(item.key)) {
      return { code: "scoreboard.metric_free.duplicate_item_key", message: `A chave de item "${item.key}" está repetida.` };
    }
    seenKeys.add(item.key);
  }

  return null;
}

export function asWidgetConfig<K extends WidgetKind>(kind: K, config: Record<string, unknown>): WidgetConfigByKind[K] {
  return config as WidgetConfigByKind[K];
}
