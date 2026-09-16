"use server";

import { revalidatePath } from "next/cache";
import { createGroup, deleteGroup, updateGroup } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";

export type ScoreboardActionState = { error: string | null };

const PLUGIN_DISABLED_ERROR = "O plugin de Indicadores está desabilitado.";
const returnTo = "/admin/scoreboard/groups";

export async function createGroupAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const result = await createGroup({
    label: String(formData.get("label") ?? ""),
    primeSegmentKey: String(formData.get("primeSegmentKey") ?? "") || undefined,
  });

  if (!result.success) return { error: result.error.message };
  revalidatePath(returnTo);
  return { error: null };
}

export async function updateGroupAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const result = await updateGroup({
    groupId: String(formData.get("groupId") ?? ""),
    label: String(formData.get("label") ?? ""),
    primeSegmentKey: String(formData.get("primeSegmentKey") ?? "") || null,
  });

  if (!result.success) return { error: result.error.message };
  revalidatePath(returnTo);
  return { error: null };
}

export async function deleteGroupAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const result = await deleteGroup({ groupId: String(formData.get("groupId") ?? "") });
  if (!result.success) return { error: result.error.message };
  revalidatePath(returnTo);
  return { error: null };
}
