import type { OperationResult } from "@venore/plugin-sdk";
import type { PrimeStatusMappingRecord } from "../../contracts/types";

export type UpdatePrimeStatusMappingInput = { mappingId: string; stageKey?: string; label?: string | null };
export type UpdatePrimeStatusMappingResult = OperationResult<PrimeStatusMappingRecord>;
