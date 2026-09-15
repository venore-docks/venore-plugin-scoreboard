import type { CreatePrimeStatusMappingInput } from "./types";

export type MappingValidationError = { code: string; message: string };

export function validateCreatePrimeStatusMappingInput(input: CreatePrimeStatusMappingInput): MappingValidationError | null {
  if (input.rawStatus.trim().length === 0) {
    return { code: "scoreboard.prime_mapping.invalid_raw_status", message: "O status cru da Prime não pode ser vazio." };
  }
  if (input.stageKey.trim().length === 0) {
    return { code: "scoreboard.prime_mapping.invalid_stage_key", message: "A etapa de destino não pode ser vazia." };
  }
  return null;
}
