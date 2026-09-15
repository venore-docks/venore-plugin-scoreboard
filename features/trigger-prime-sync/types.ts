import type { OperationResult } from "@venore/plugin-sdk";
import type { PrimeSyncLogRecord } from "../../contracts/types";

export type TriggerPrimeSyncCommand = { actorId: string };
export type TriggerPrimeSyncResult = OperationResult<PrimeSyncLogRecord>;
