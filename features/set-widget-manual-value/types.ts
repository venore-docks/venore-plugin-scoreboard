import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

// Edição pontual de UM número dentro do config, sem reenviar o objeto inteiro — é a "entrada
// manual de valores" pedida explicitamente pelo chefe do usuário (lançar inscrições, documentação
// etc. à mão enquanto a Prime não está integrada).
export type SetWidgetManualValueCommand =
  | {
      widgetId: string;
      kind: "goal_progress";
      groupKey: string;
      field: "newStudentsGoal" | "newStudentsActual" | "retentionTargetPercent" | "eligibleBase" | "reenrolledActual";
      value: number;
      actorId: string;
    }
  | { widgetId: string; kind: "funnel"; groupKey: string; stageKey: string; value: number; actorId: string }
  | { widgetId: string; kind: "metric_free"; itemKey: string; value: number; actorId: string };

// NÃO usar `Omit<SetWidgetManualValueCommand, "actorId">` aqui — `Omit`/`Pick` não distribuem
// sobre union types (keyof de uma union é a INTERSEÇÃO das chaves, não a união), então isso
// colapsaria o resultado pras três chaves comuns (widgetId/kind/value) e apagaria
// groupKey/field/stageKey/itemKey de cada variante. Union escrita à mão, espelhando o Command.
export type SetWidgetManualValueInput =
  | {
      widgetId: string;
      kind: "goal_progress";
      groupKey: string;
      field: "newStudentsGoal" | "newStudentsActual" | "retentionTargetPercent" | "eligibleBase" | "reenrolledActual";
      value: number;
    }
  | { widgetId: string; kind: "funnel"; groupKey: string; stageKey: string; value: number }
  | { widgetId: string; kind: "metric_free"; itemKey: string; value: number };

export type SetWidgetManualValueResult = OperationResult<WidgetRecord>;
