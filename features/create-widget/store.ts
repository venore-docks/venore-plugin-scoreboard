import { desc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardWidgets } from "../../database/schema";
import type { WidgetDataSource, WidgetKind, WidgetRecord } from "../../contracts/types";

export async function findMaxWidgetOrder(boardId: string): Promise<number> {
  const [row] = await db
    .select({ order: scoreboardWidgets.order })
    .from(scoreboardWidgets)
    .where(eq(scoreboardWidgets.boardId, boardId))
    .orderBy(desc(scoreboardWidgets.order))
    .limit(1);
  return row?.order ?? -1;
}

export async function insertWidget(input: {
  boardId: string;
  kind: WidgetKind;
  title: string;
  order: number;
  dataSource: WidgetDataSource;
  config: Record<string, unknown>;
}): Promise<WidgetRecord> {
  const [row] = await db.insert(scoreboardWidgets).values(input).returning();
  return row as WidgetRecord;
}
