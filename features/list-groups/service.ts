import { findAllGroups } from "./store";
import type { ListGroupsResult } from "./types";

export async function listGroups(): Promise<ListGroupsResult> {
  return { success: true, data: await findAllGroups() };
}
