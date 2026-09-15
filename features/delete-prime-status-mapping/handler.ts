import { authorizeMappingActor } from "../../shared/scoped-authorization";
import { deletePrimeStatusMapping } from "./service";
import type { DeletePrimeStatusMappingInput, DeletePrimeStatusMappingResult } from "./types";

export async function deletePrimeStatusMappingHandler(input: DeletePrimeStatusMappingInput): Promise<DeletePrimeStatusMappingResult> {
  const authz = await authorizeMappingActor(input.mappingId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deletePrimeStatusMapping(input);
}
