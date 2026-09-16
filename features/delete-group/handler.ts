import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteGroup } from "./service";
import type { DeleteGroupInput, DeleteGroupResult } from "./types";

export async function deleteGroupHandler(input: DeleteGroupInput): Promise<DeleteGroupResult> {
  const authz = await authorizeActor("scoreboard.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deleteGroup(input);
}
