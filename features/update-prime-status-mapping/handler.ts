import { authorizeMappingActor } from "../../shared/scoped-authorization";
import { updatePrimeStatusMapping } from "./service";
import type { UpdatePrimeStatusMappingInput, UpdatePrimeStatusMappingResult } from "./types";

export async function updatePrimeStatusMappingHandler(input: UpdatePrimeStatusMappingInput): Promise<UpdatePrimeStatusMappingResult> {
  const authz = await authorizeMappingActor(input.mappingId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updatePrimeStatusMapping(input);
}
