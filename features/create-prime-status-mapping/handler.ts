import { authorizeBoardActor } from "../../shared/scoped-authorization";
import { createPrimeStatusMapping } from "./service";
import { validateCreatePrimeStatusMappingInput } from "./validation";
import type { CreatePrimeStatusMappingInput, CreatePrimeStatusMappingResult } from "./types";

export async function createPrimeStatusMappingHandler(input: CreatePrimeStatusMappingInput): Promise<CreatePrimeStatusMappingResult> {
  const validationError = validateCreatePrimeStatusMappingInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeBoardActor(input.boardId);
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createPrimeStatusMapping({ ...input, actorId: authz.actorId });
}
