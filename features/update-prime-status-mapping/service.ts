import { applyMappingUpdate, findMappingById, findValidStageKeysForBoard } from "./store";
import type { UpdatePrimeStatusMappingInput, UpdatePrimeStatusMappingResult } from "./types";

export async function updatePrimeStatusMapping(input: UpdatePrimeStatusMappingInput): Promise<UpdatePrimeStatusMappingResult> {
  const existing = await findMappingById(input.mappingId);
  if (!existing) {
    return { success: false, error: { code: "scoreboard.prime_mapping.not_found", message: "Mapeamento não encontrado." } };
  }

  if (input.stageKey !== undefined) {
    const validStageKeys = await findValidStageKeysForBoard(existing.boardId);
    if (!validStageKeys.has(input.stageKey)) {
      return {
        success: false,
        error: { code: "scoreboard.prime_mapping.unknown_stage_key", message: `A etapa "${input.stageKey}" não existe no funil deste board.` },
      };
    }
  }

  const mapping = await applyMappingUpdate(input.mappingId, {
    stageKey: input.stageKey,
    label: input.label === undefined ? undefined : input.label?.trim() || null,
  });

  return { success: true, data: mapping };
}
