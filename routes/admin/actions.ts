"use server";

import { revalidatePath } from "next/cache";
import { createBoard, deleteBoard } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";

export type ScoreboardActionState = { error: string | null };

const returnTo = "/admin/scoreboard";
const PLUGIN_DISABLED_ERROR = "O plugin de Indicadores está desabilitado.";

export async function createBoardAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await createBoard({
    name: String(formData.get("name") ?? ""),
    sector: String(formData.get("sector") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
  });

  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(returnTo);
  return { error: null };
}

export async function deleteBoardAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) {
    return { error: PLUGIN_DISABLED_ERROR };
  }

  const result = await deleteBoard({ boardId: String(formData.get("boardId") ?? "") });
  if (!result.success) {
    return { error: result.error.message };
  }

  revalidatePath(returnTo);
  return { error: null };
}
