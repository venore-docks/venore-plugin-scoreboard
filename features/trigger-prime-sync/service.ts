import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { publishBoardEvent } from "../../runtime/board-bus";
import { applyStatusMapping, type PrimeGroupResolution } from "../../shared/prime-client/apply-status-mapping";
import { getPrimeClient } from "../../shared/prime-client/get-prime-client";
import type { GoalProgressWidgetConfig, FunnelWidgetConfig } from "../../shared/widget-config/types";
import {
  applyWidgetSyncUpdate,
  findAllStudentsRaw,
  findBoardsWithPrimeSyncWidgets,
  findGroupsByKeys,
  findMappingsForBoard,
  finishLog,
  insertRunningLog,
  upsertStudentsRaw,
  type PrimeSyncBoardTarget,
} from "./store";
import type { TriggerPrimeSyncCommand, TriggerPrimeSyncResult } from "./types";

// Toda key de grupo referenciada por este board — tanto pelo widget goal_progress quanto pelo
// funnel (os dois passaram a compartilhar o mesmo catálogo, ver database/schema/index.ts,
// scoreboardGroups). É o conjunto que precisa de primeSegmentKey resolvido pra sincronizar.
function collectTargetGroupKeys(target: PrimeSyncBoardTarget): Set<string> {
  const keys = new Set<string>();
  for (const widget of target.widgets) {
    if (widget.kind === "goal_progress") {
      for (const group of (widget.config as GoalProgressWidgetConfig).groups ?? []) keys.add(group.key);
    } else if (widget.kind === "funnel") {
      for (const key of Object.keys((widget.config as FunnelWidgetConfig).countsByGroup ?? {})) keys.add(key);
    }
  }
  return keys;
}

function resolveGroupsAndTerminalStage(
  target: PrimeSyncBoardTarget,
  primeSegmentKeyByGroupKey: Map<string, string | null>,
): {
  groups: PrimeGroupResolution[];
  terminalStageKey: string | null;
  funnelWidgetId: string | null;
  goalWidgetId: string | null;
} {
  const funnelWidget = target.widgets.find((widget) => widget.kind === "funnel") ?? null;
  const goalWidget = target.widgets.find((widget) => widget.kind === "goal_progress") ?? null;

  // primeSegmentKey agora vem do catálogo compartilhado (era um campo solto em cada
  // GoalProgressGroup antes desta mudança) — fallback pra própria key se o catálogo não tiver
  // (grupo sem primeSegmentKey configurado ainda).
  const groups: PrimeGroupResolution[] = [...collectTargetGroupKeys(target)].map((groupKey) => ({
    groupKey,
    primeSegmentKey: primeSegmentKeyByGroupKey.get(groupKey) ?? groupKey,
  }));

  const stages = funnelWidget ? (funnelWidget.config as FunnelWidgetConfig).stages ?? [] : [];
  const terminalStageKey = stages.length > 0 ? [...stages].sort((a, b) => b.order - a.order)[0].key : null;

  return { groups, terminalStageKey, funnelWidgetId: funnelWidget?.id ?? null, goalWidgetId: goalWidget?.id ?? null };
}

export async function triggerPrimeSync(command: TriggerPrimeSyncCommand): Promise<TriggerPrimeSyncResult> {
  const handle = beginOperation({
    useCase: "scoreboard.trigger-prime-sync",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const log = await insertRunningLog(command.actorId);

  let studentsFetched = 0;
  try {
    const students = await getPrimeClient().fetchStudents();
    studentsFetched = students.length;
    const studentsUpserted = await upsertStudentsRaw(students, log.id);

    const allStudents = await findAllStudentsRaw();
    const targets = await findBoardsWithPrimeSyncWidgets();

    const allGroupKeys = new Set<string>();
    for (const target of targets) for (const key of collectTargetGroupKeys(target)) allGroupKeys.add(key);
    const catalogGroups = await findGroupsByKeys([...allGroupKeys]);
    const primeSegmentKeyByGroupKey = new Map(catalogGroups.map((group) => [group.key, group.primeSegmentKey]));

    const boardsRecomputed: string[] = [];

    for (const target of targets) {
      const { groups, terminalStageKey, funnelWidgetId, goalWidgetId } = resolveGroupsAndTerminalStage(target, primeSegmentKeyByGroupKey);
      const statusMapping = await findMappingsForBoard(target.boardId);
      const applied = applyStatusMapping({ students: allStudents, statusMapping, groups, terminalStageKey });

      if (funnelWidgetId) {
        const funnelWidget = target.widgets.find((widget) => widget.id === funnelWidgetId)!;
        const config = funnelWidget.config as FunnelWidgetConfig;
        await applyWidgetSyncUpdate(funnelWidgetId, { ...config, countsByGroup: applied.funnelCountsByGroup });
      }

      if (goalWidgetId) {
        const goalWidget = target.widgets.find((widget) => widget.id === goalWidgetId)!;
        const config = goalWidget.config as GoalProgressWidgetConfig;
        const nextGroups = (config.groups ?? []).map((group) => {
          const terminal = applied.terminalCountsByGroup[group.key];
          if (!terminal) return group;
          return { ...group, newStudentsActual: terminal.new, reenrolledActual: terminal.reenrollment };
        });
        await applyWidgetSyncUpdate(goalWidgetId, { ...config, groups: nextGroups });
      }

      boardsRecomputed.push(target.boardId);
      publishBoardEvent(target.boardId, { type: "board-changed" });
    }

    const finished = await finishLog(log.id, { status: "success", studentsFetched, studentsUpserted, boardsRecomputed });
    endOperation(handle, { success: true });
    return { success: true, data: finished };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Falha desconhecida ao sincronizar com a Prime.";
    // O registro completo (status "failed", com esta mensagem) fica em prime_sync_log — a UI do
    // admin lê pelo get-prime-sync-status, não precisa vir no retorno deste handler.
    await finishLog(log.id, { status: "failed", studentsFetched, errorMessage });
    const failure = { code: "scoreboard.prime_sync.failed", message: errorMessage };
    endOperation(handle, { success: false, error: failure });
    return { success: false, error: failure };
  }
}
