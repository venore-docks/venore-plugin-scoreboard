import type { OperationResult } from "@venore/plugin-sdk";
import type { PrimeStatusMappingRecord } from "../../contracts/types";

export type ListPrimeStatusMappingInput = { boardId: string };
export type ListPrimeStatusMappingResult = OperationResult<PrimeStatusMappingRecord[]>;
