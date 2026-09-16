import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardWidgets } from "../../database/schema";
import type { WidgetRecord } from "../../contracts/types";

export async function findWidgetById(id: string): Promise<WidgetRecord | null> {
  const [row] = await db.select().from(scoreboardWidgets).where(eq(scoreboardWidgets.id, id)).limit(1);
  return (row as WidgetRecord) ?? null;
}

export async function applyWidgetConfig(widgetId: string, config: Record<string, unknown>): Promise<WidgetRecord> {
  const [row] = await db
    .update(scoreboardWidgets)
    .set({ config, updatedAt: sql`now()` })
    .where(eq(scoreboardWidgets.id, widgetId))
    .returning();
  return row as WidgetRecord;
}
