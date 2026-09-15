import type { OperationResult } from "@venore/plugin-sdk";
import type { PrimeSyncLogRecord } from "../../contracts/types";

export type GetPrimeSyncStatusResult = OperationResult<PrimeSyncLogRecord[]>;
