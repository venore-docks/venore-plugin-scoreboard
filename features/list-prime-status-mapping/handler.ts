import { authorizeBoardActor } from "../../shared/scoped-authorization";
import { listPrimeStatusMapping } from "./service";
import type { ListPrimeStatusMappingInput, ListPrimeStatusMappingResult } from "./types";

export async function listPrimeStatusMappingHandler(input: ListPrimeStatusMappingInput): Promise<ListPrimeStatusMappingResult> {
  const authz = await authorizeBoardActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listPrimeStatusMapping(input);
}
