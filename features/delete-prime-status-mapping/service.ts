import { deleteMappingById } from "./store";
import type { DeletePrimeStatusMappingInput, DeletePrimeStatusMappingResult } from "./types";

export async function deletePrimeStatusMapping(input: DeletePrimeStatusMappingInput): Promise<DeletePrimeStatusMappingResult> {
  const deleted = await deleteMappingById(input.mappingId);
  if (!deleted) {
    return { success: false, error: { code: "scoreboard.prime_mapping.not_found", message: "Mapeamento não encontrado." } };
  }
  return { success: true, data: { id: input.mappingId } };
}
