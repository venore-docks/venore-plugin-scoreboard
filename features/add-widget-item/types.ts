import type { OperationResult } from "@venore/plugin-sdk";
import type { WidgetRecord } from "../../contracts/types";

// "Item" aqui é o termo genérico pro que cada kind chama de grupo (goal_progress), etapa (funnel)
// ou item (metric_free) — uma entrada nova na lista do widget. Só pede um rótulo (+ unidade
// opcional pro metric_free); a chave (key) é derivada automaticamente do rótulo em service.ts —
// requisito explícito: "método clean para inserir os dados", sem o admin precisar editar JSON nem
// pensar em slug.
export type AddWidgetItemCommand =
  | { widgetId: string; kind: "goal_progress"; label: string; actorId: string }
  | { widgetId: string; kind: "funnel"; label: string; actorId: string }
  | { widgetId: string; kind: "metric_free"; label: string; unit?: string; actorId: string };

// NÃO usar `Omit<AddWidgetItemCommand, "actorId">` — `Omit`/`Pick` não distribuem sobre union
// types (keyof de uma union é a INTERSEÇÃO das chaves), então isso apagaria `unit`, que só existe
// na variante metric_free (mesmo bug já corrigido em features/set-widget-manual-value/types.ts).
export type AddWidgetItemInput =
  | { widgetId: string; kind: "goal_progress"; label: string }
  | { widgetId: string; kind: "funnel"; label: string }
  | { widgetId: string; kind: "metric_free"; label: string; unit?: string };

export type AddWidgetItemResult = OperationResult<WidgetRecord>;
