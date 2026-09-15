import { findMappingsByBoard } from "./store";
import type { ListPrimeStatusMappingInput, ListPrimeStatusMappingResult } from "./types";

export async function listPrimeStatusMapping(input: ListPrimeStatusMappingInput): Promise<ListPrimeStatusMappingResult> {
  return { success: true, data: await findMappingsByBoard(input.boardId) };
}
