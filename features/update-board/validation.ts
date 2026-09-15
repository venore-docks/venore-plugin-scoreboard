import type { BoardValidationError } from "../create-board/validation";
import type { UpdateBoardInput } from "./types";

export function validateUpdateBoardInput(input: UpdateBoardInput): BoardValidationError | null {
  if (input.name !== undefined && input.name.trim().length === 0) {
    return { code: "scoreboard.boards.invalid_name", message: "O nome do quadro não pode ser vazio." };
  }
  if (input.sector !== undefined && input.sector.trim().length === 0) {
    return { code: "scoreboard.boards.invalid_sector", message: "O setor dono do quadro não pode ser vazio." };
  }
  return null;
}
