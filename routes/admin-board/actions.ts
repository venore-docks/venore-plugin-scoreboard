"use server";

import { revalidatePath } from "next/cache";
import {
  addWidgetItem,
  createWidget,
  deleteWidget,
  removeWidgetItem,
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

// Edição de ESTRUTURA (adicionar/remover grupo, etapa ou item) — formulário dedicado por kind
// (goal-progress-editor.tsx / funnel-editor.tsx / metric-free-editor.tsx), nunca JSON cru: o
// requisito era um "método clean" pra quem lança os números não precisar tocar em JSON. A key é
// derivada do rótulo em features/add-widget-item/service.ts.
export async function addWidgetItemAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const widgetId = String(formData.get("widgetId") ?? "");
  const kind = String(formData.get("kind") ?? "") as "goal_progress" | "funnel" | "metric_free";
  const label = String(formData.get("label") ?? "");

  const result = await addWidgetItem(
    kind === "metric_free" ? { widgetId, kind, label, unit: String(formData.get("unit") ?? "") || undefined } : { widgetId, kind, label },
  );

  if (!result.success) return { error: result.error.message };
  revalidatePath(boardPath(boardId));
  return { error: null };
}

export async function removeWidgetItemAction(
  _prevState: ScoreboardActionState,
  formData: FormData,
): Promise<ScoreboardActionState> {
  if (!(await isPluginActive("scoreboard"))) return { error: PLUGIN_DISABLED_ERROR };

  const boardId = String(formData.get("boardId") ?? "");
  const widgetId = String(formData.get("widgetId") ?? "");
  const kind = String(formData.get("kind") ?? "") as "goal_progress" | "funnel" | "metric_free";
  const key = String(formData.get("key") ?? "");

  const result = await removeWidgetItem({ widgetId, kind, key });
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
