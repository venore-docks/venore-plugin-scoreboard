import type { OperationResult } from "@venore/plugin-sdk";
import type { PrimeStatusMappingRecord } from "../../contracts/types";

export type CreatePrimeStatusMappingCommand = {
  boardId: string;
  rawStatus: string;
  stageKey: string;
  label?: string | null;
  actorId: string;
};

export type CreatePrimeStatusMappingInput = Omit<CreatePrimeStatusMappingCommand, "actorId">;
export type CreatePrimeStatusMappingResult = OperationResult<PrimeStatusMappingRecord>;
