import type { OperationResult } from "@venore/plugin-sdk";

export type DeletePrimeStatusMappingInput = { mappingId: string };
export type DeletePrimeStatusMappingResult = OperationResult<{ id: string }>;
