import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { updateGroup } from "./service";
import type { UpdateGroupInput, UpdateGroupResult } from "./types";

export async function updateGroupHandler(input: UpdateGroupInput): Promise<UpdateGroupResult> {
  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateGroup(input);
}
