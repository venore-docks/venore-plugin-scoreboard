"use server";

import { revalidatePath } from "next/cache";
import {
  createWidget,
  deleteWidget,
  setBoardEditors,
  setWidgetManualValue,
  updateBoard,
  updateWidget,
} from "../../index";
import { emptyWidgetConfig, type WidgetKind } from "../../shared/widget-config/types";
import { isPluginActive } from "@venore/plugin-sdk";

export type ScoreboardActionState = { error: string | null };

const PLUGIN_DISABLED_ERROR = "O plugin de Indicadores está desabilitado.";

function boardPath(boardId: string): string {
  return `/admin/scoreboard/${boardId}`;
}

export async function updateBoardSettingsAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const result = await updateBoard({
    boardId,
    name: String(formData.get("name") ?? ""),
    sector: String(formData.get("sector") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    published: formData.get("published") === "on",
  });

  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

export async function setBoardEditorsAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const userIds = String(formData.get("userIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const result = await setBoardEditors({ boardId, userIds });
  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

export async function createWidgetAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const kind = String(formData.get("kind") ?? "") as WidgetKind;
  const title = String(formData.get("title") ?? "");

  const result = await createWidget({ boardId, kind, title, config: emptyWidgetConfig(kind) });
  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

export async function deleteWidgetAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const result = await deleteWidget({ widgetId: String(formData.get("widgetId") ?? "") });
  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

// Edição de ESTRUTURA (adicionar/remover grupo, etapa ou item) via JSON — os números do dia a dia
// são editados pelos inputs de setWidgetManualValueAction abaixo; a estrutura muda raramente
// (uma vez, ao montar o board), então um textarea JSON aqui é proporcional ao uso.
export async function updateWidgetStructureAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const widgetId = String(formData.get("widgetId") ?? "");
  const rawConfig = String(formData.get("config") ?? "");

  let config: Record<string, unknown>;
  try {
    config = JSON.parse(rawConfig);
  } catch {
    return { error: "JSON inválido — confira a formatação." };
  }

  const result = await updateWidget({ widgetId, config });
  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

export async function updateWidgetTitleAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const result = await updateWidget({ widgetId: String(formData.get("widgetId") ?? ""), title: String(formData.get("title") ?? "") });
  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

export async function setWidgetManualValueAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const widgetId = String(formData.get("widgetId") ?? "");
  const kind = String(formData.get("kind") ?? "") as "goal_progress" | "funnel" | "metric_free";
  const value = Number(formData.get("value"));

  type GoalProgressField = "newStudentsGoal" | "newStudentsActual" | "retentionTargetPercent" | "eligibleBase" | "reenrolledActual";

  let result;
  if (kind === "goal_progress") {
    result = await setWidgetManualValue({
      widgetId,
      kind,
      groupKey: String(formData.get("groupKey") ?? ""),
      field: String(formData.get("field") ?? "") as GoalProgressField,
      value,
    });
  } else if (kind === "funnel") {
    result = await setWidgetManualValue({
      widgetId,
      kind,
      groupKey: String(formData.get("groupKey") ?? ""),
      stageKey: String(formData.get("stageKey") ?? ""),
      value,
    });
  } else {
    result = await setWidgetManualValue({ widgetId, kind, itemKey: String(formData.get("itemKey") ?? ""), value });
  }

  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}
