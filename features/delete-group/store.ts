import { eq, inArray } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { scoreboardGroups, scoreboardWidgets } from "../../database/schema";
import type { GroupRecord } from "../../contracts/types";
import type { FunnelWidgetConfig, GoalProgressWidgetConfig } from "../../shared/widget-config/types";

export async function findGroupById(id: string): Promise<GroupRecord | null> {
  const [row] = await db.select().from(scoreboardGroups).where(eq(scoreboardGroups.id, id)).limit(1);
  return (row as GroupRecord) ?? null;
}

// Varre os widgets goal_progress/funnel de TODOS os boards em busca da key — volume pequeno
// (algumas dezenas de widgets no total, não milhares), então um SELECT + filtro em JS é claro e
// suficiente, mesmo racional já usado em features/trigger-prime-sync/store.ts
// (upsertStudentsRaw). Sem isso, apagar um curso em uso deixaria um `key` órfão dentro do jsonb de
// algum widget, sem nenhum FK físico pra avisar.
export async function isGroupInUse(key: string): Promise<boolean> {
  const widgets = await db
    .select({ kind: scoreboardWidgets.kind, config: scoreboardWidgets.config })
    .from(scoreboardWidgets)
    .where(inArray(scoreboardWidgets.kind, ["goal_progress", "funnel"]));

  return widgets.some((widget) => {
    if (widget.kind === "goal_progress") {
      return ((widget.config as GoalProgressWidgetConfig).groups ?? []).some((group) => group.key === key);
    }
    return Object.prototype.hasOwnProperty.call((widget.config as FunnelWidgetConfig).countsByGroup ?? {}, key);
  });
}

export async function deleteGroupById(id: string): Promise<boolean> {
  const rows = await db.delete(scoreboardGroups).where(eq(scoreboardGroups.id, id)).returning({ id: scoreboardGroups.id });
  return rows.length > 0;
}
