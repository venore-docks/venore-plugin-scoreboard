import type { OperationResult } from "@venore/plugin-sdk";
import type { GroupRecord } from "../../contracts/types";

export type CreateGroupCommand = { label: string; primeSegmentKey?: string; actorId: string };
export type CreateGroupInput = Omit<CreateGroupCommand, "actorId">;
export type CreateGroupResult = OperationResult<GroupRecord>;
