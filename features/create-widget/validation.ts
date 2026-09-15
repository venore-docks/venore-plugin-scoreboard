import { WIDGET_KINDS } from "../../shared/widget-config/types";
import { validateWidgetConfig, type WidgetConfigValidationError } from "../../shared/widget-config/validate-widget-config";
import type { CreateWidgetInput } from "./types";

export function validateCreateWidgetInput(input: CreateWidgetInput): WidgetConfigValidationError | null {
  if (input.title.trim().length === 0) {
    return { code: "scoreboard.widgets.invalid_title", message: "O título do widget não pode ser vazio." };
  }
  if (!WIDGET_KINDS.includes(input.kind)) {
    return { code: "scoreboard.widgets.invalid_kind", message: `Tipo de widget desconhecido: "${input.kind}".` };
  }
  return validateWidgetConfig(input.kind, input.config);
}
