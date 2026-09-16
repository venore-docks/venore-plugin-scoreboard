import type { OperationResult } from "@venore/plugin-sdk";
import type { GroupRecord } from "../../contracts/types";

export type ListGroupsResult = OperationResult<GroupRecord[]>;
