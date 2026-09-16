import type { CreateGroupInput } from "./types";

export type GroupValidationError = { code: string; message: string };

export function validateCreateGroupInput(input: CreateGroupInput): GroupValidationError | null {
  if (input.label.trim().length === 0) {
    return { code: "scoreboard.groups.invalid_label", message: "O nome do curso/segmento não pode ser vazio." };
  }
  return null;
}
