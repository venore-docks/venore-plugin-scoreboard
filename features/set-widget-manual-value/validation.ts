import type { SetWidgetManualValueInput } from "./types";

export type WidgetValueValidationError = { code: string; message: string };

export function validateSetWidgetManualValueInput(input: SetWidgetManualValueInput): WidgetValueValidationError | null {
  if (!Number.isFinite(input.value) || input.value < 0) {
    return { code: "scoreboard.widgets.invalid_value", message: "O valor precisa ser um número maior ou igual a zero." };
  }
  if (input.kind === "goal_progress" && input.field === "retentionTargetPercent" && input.value > 100) {
    return { code: "scoreboard.widgets.invalid_percent", message: "O percentual de retenção não pode passar de 100." };
  }
  return null;
}
