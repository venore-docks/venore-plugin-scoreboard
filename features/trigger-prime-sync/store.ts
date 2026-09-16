import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import {
  scoreboardGroups,
  scoreboardPrimeStatusMapping,
  scoreboardPrimeStudentRaw,
  scoreboardPrimeSyncLog,
  scoreboardWidgets,
} from "../../database/schema";
import type { PrimeStudentDTO } from "../../shared/prime-client/types";
import type { GroupRecord, PrimeSyncLogRecord, WidgetRecord } from "../../contracts/types";

export async function insertRunningLog(triggeredByUserId: string): Promise<PrimeSyncLogRecord> {
  const [row] = await db.insert(scoreboardPrimeSyncLog).values({ triggeredByUserId, status: "running" }).returning();
  return row as PrimeSyncLogRecord;
}

export async function finishLog(
  logId: string,
  patch: {
    status: "success" | "failed";
    studentsFetched?: number;
    studentsUpserted?: number;
    boardsRecomputed?: string[];
    errorMessage?: string | null;
  },
): Promise<PrimeSyncLogRecord> {
  const [row] = await db
    .update(scoreboardPrimeSyncLog)
    .set({ ...patch, finishedAt: new Date() })
    .where(eq(scoreboardPrimeSyncLog.id, logId))
    .returning();
  return row as PrimeSyncLogRecord;
}

// Upsert por externalStudentId (uniqueIndex) — loop simples, não bulk: volume esperado por sync é
// o corpo discente de duas ou três campanhas, não milhões de linhas. Mesmo racional de
// contexts/content-feed/features/subscriber/sync-source/store.ts (upsertArticles).
export async function upsertStudentsRaw(students: PrimeStudentDTO[], syncLogId: string): Promise<number> {
  let count = 0;
  for (const student of students) {
    await db
      .insert(scoreboardPrimeStudentRaw)
      .values({
        externalStudentId: student.externalId,
        rawSegmentOrCourse: student.segmentOrCourse,
        rawEnrollmentType: student.enrollmentType,
        rawStatus: student.rawStatus,
        primeSyncLogId: syncLogId,
      })
      .onConflictDoUpdate({
        target: scoreboardPrimeStudentRaw.externalStudentId,
        set: {
          rawSegmentOrCourse: student.segmentOrCourse,
          rawEnrollmentType: student.enrollmentType,
          rawStatus: student.rawStatus,
          syncedAt: new Date(),
          primeSyncLogId: syncLogId,
        },
      });
    count += 1;
  }
  return count;
}

export async function findAllStudentsRaw(): Promise<PrimeStudentDTO[]> {
  const rows = await db.select().from(scoreboardPrimeStudentRaw);
  return rows.map((row) => ({
    externalId: row.externalStudentId,
    segmentOrCourse: row.rawSegmentOrCourse,
    enrollmentType: row.rawEnrollmentType as PrimeStudentDTO["enrollmentType"],
    rawStatus: row.rawStatus,
  }));
}

export type PrimeSyncBoardTarget = { boardId: string; widgets: WidgetRecord[] };

// Boards com pelo menos um widget dataSource=prime_sync, agrupados — é isso que trigger-prime-sync
// recalcula a cada rodada; boards 100% manuais nunca são tocados.
export async function findBoardsWithPrimeSyncWidgets(): Promise<PrimeSyncBoardTarget[]> {
  const widgets = await db.select().from(scoreboardWidgets).where(eq(scoreboardWidgets.dataSource, "prime_sync"));

  const byBoard = new Map<string, WidgetRecord[]>();
  for (const widget of widgets as WidgetRecord[]) {
    const list = byBoard.get(widget.boardId) ?? [];
    list.push(widget);
    byBoard.set(widget.boardId, list);
  }
  return [...byBoard.entries()].map(([boardId, boardWidgets]) => ({ boardId, widgets: boardWidgets }));
}

export async function findMappingsForBoard(boardId: string): Promise<Array<{ rawStatus: string; stageKey: string }>> {
  const rows = await db
    .select({ rawStatus: scoreboardPrimeStatusMapping.rawStatus, stageKey: scoreboardPrimeStatusMapping.stageKey })
    .from(scoreboardPrimeStatusMapping)
    .where(eq(scoreboardPrimeStatusMapping.boardId, boardId))
    .orderBy(asc(scoreboardPrimeStatusMapping.rawStatus));
  return rows;
}

// primeSegmentKey mora no catálogo compartilhado agora (database/schema/index.ts,
// scoreboardGroups), não mais espalhado por GoalProgressGroup — resolvido uma vez por rodada de
// sync pra todas as keys usadas por todos os boards prime_sync (ver service.ts).
export async function findGroupsByKeys(keys: string[]): Promise<GroupRecord[]> {
  if (keys.length === 0) return [];
  const rows = await db.select().from(scoreboardGroups).where(inArray(scoreboardGroups.key, keys));
  return rows as GroupRecord[];
}

export async function applyWidgetSyncUpdate(widgetId: string, config: Record<string, unknown>): Promise<void> {
  await db
    .update(scoreboardWidgets)
    .set({ config, lastSyncedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(scoreboardWidgets.id, widgetId), eq(scoreboardWidgets.dataSource, "prime_sync")));
}
