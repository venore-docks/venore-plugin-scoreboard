import type { CreateBoardInput } from "./types";

export type BoardValidationError = { code: string; message: string };

export function validateCreateBoardInput(input: CreateBoardInput): BoardValidationError | null {
  if (input.name.trim().length === 0) {
    return { code: "scoreboard.boards.invalid_name", message: "O nome do quadro não pode ser vazio." };
  }
  if (input.sector.trim().length === 0) {
    return { code: "scoreboard.boards.invalid_sector", message: "O setor dono do quadro não pode ser vazio." };
  }
  return null;
}
