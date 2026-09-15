import type { UpdateWidgetInput } from "./types";

export type WidgetValidationError = { code: string; message: string };

export function validateUpdateWidgetInput(input: UpdateWidgetInput): WidgetValidationError | null {
  if (input.title !== undefined && input.title.trim().length === 0) {
    return { code: "scoreboard.widgets.invalid_title", message: "O título do widget não pode ser vazio." };
  }
  return null;
}
