"use server";

import { revalidatePath } from "next/cache";
import { createPrimeStatusMapping, deletePrimeStatusMapping } from "../../index";
import { isPluginActive } from "@venore/plugin-sdk";

export type ScoreboardActionState = { error: string | null };

const PLUGIN_DISABLED_ERROR = "O plugin de Indicadores está desabilitado.";

function mappingPath(boardId: string): string {
  return `/admin/scoreboard/${boardId}/prime-mapping`;
}

export async function createMappingAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const result = await createPrimeStatusMapping({
    boardId,
    rawStatus: String(formData.get("rawStatus") ?? ""),
    stageKey: String(formData.get("stageKey") ?? ""),
    label: String(formData.get("label") ?? "") || undefined,
  });

  if (!result.success) return { error: result.error.message };
  revalidatePath(mappingPath(boardId));
  return { error: null };
}

export async function deleteMappingAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const result = await deletePrimeStatusMapping({ mappingId: String(formData.get("mappingId") ?? "") });
  if (!result.success) return { error: result.error.message };
  revalidatePath(mappingPath(boardId));
  return { error: null };
}
