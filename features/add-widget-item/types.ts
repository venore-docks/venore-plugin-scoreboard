import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

// "Item" aqui é o que cada kind chama de etapa (funnel) ou item (metric_free) — uma entrada nova
// texto-livre na lista do widget, com a key derivada do rótulo em service.ts. NÃO cobre mais
// goal_progress: o "grupo" (curso/segmento) agora vem do catálogo compartilhado
// (database/schema/index.ts, scoreboardGroups) — atribuir um grupo existente a um widget é
// features/assign-widget-group, não isto aqui.
export type AddWidgetItemCommand =
  | { widgetId: string; kind: "funnel"; label: string; actorId: string }
  | { widgetId: string; kind: "metric_free"; label: string; unit?: string; actorId: string };

// NÃO usar `Omit<AddWidgetItemCommand, "actorId">` — `Omit`/`Pick` não distribuem sobre union
// types (keyof de uma union é a INTERSEÇÃO das chaves), então isso apagaria `unit`, que só existe
// na variante metric_free (mesmo bug já corrigido em features/set-widget-manual-value/types.ts).
export type AddWidgetItemInput =
  | { widgetId: string; kind: "funnel"; label: string }
  | { widgetId: string; kind: "metric_free"; label: string; unit?: string };

export type AddWidgetItemResult = OperationResult<WidgetRecord>;
