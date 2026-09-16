import type { AddWidgetItemInput } from "./types";

export type WidgetItemValidationError = { code: string; message: string };

export function validateAddWidgetItemInput(input: AddWidgetItemInput): WidgetItemValidationError | null {
  if (input.label.trim().length === 0) {
    return { code: "scoreboard.widgets.invalid_item_label", message: "O rótulo não pode ser vazio." };
  }
  return null;
}
