import type { BoardViewWidget } from "../features/get-board-view/types";
import type { GoalProgressGroupSummary } from "./widget-config/compute-goal-progress";
import type { FunnelStage, MetricFreeItem } from "./widget-config/types";

// Requisito explícito: a tela de TV não pode ter scroll — em vez de empilhar todos os widgets numa
// coluna rolável (o que o board-canvas.tsx da versão web faz, e ali está certo — navegador de
// mesa, tudo bem rolar), a informação é DILUÍDA em mais de uma tela: cada página do rodízio mostra
// só um widget (ou um pedaço dele, se tiver grupos/itens demais pra caber num quadro só), grande e
// focado. O rodízio (avançar sozinho a cada N segundos) é implementado em components/board-view/
// tv-canvas.tsx; este módulo só decide COMO fatiar os widgets em páginas — puro, testável sem DOM.

// Acima disso, o card por página fica apertado num palco 1920x1080 — melhor dividir em mais
// páginas do que arriscar um quadro cortado (o requisito é "sem scroll", nunca "conteúdo cortado").
const MAX_GOAL_PROGRESS_GROUPS_PER_PAGE = 4;
const MAX_METRIC_FREE_ITEMS_PER_PAGE = 6;

export type TvPage =
  | { key: string; kind: "goal_progress"; title: string; groups: GoalProgressGroupSummary[]; pageIndex: number; pageCount: number }
  | { key: string; kind: "funnel"; title: string; stages: FunnelStage[]; countsByGroup: Record<string, Record<string, number>> }
  | { key: string; kind: "metric_free"; title: string; items: MetricFreeItem[]; pageIndex: number; pageCount: number };

function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

export function buildTvPages(widgets: BoardViewWidget[]): TvPage[] {
  const pages: TvPage[] = [];

  for (const widget of widgets) {
    if (widget.kind === "goal_progress") {
      const chunks = chunk(widget.groups, MAX_GOAL_PROGRESS_GROUPS_PER_PAGE);
      chunks.forEach((groups, pageIndex) => {
        pages.push({ key: `${widget.id}-${pageIndex}`, kind: "goal_progress", title: widget.title, groups, pageIndex, pageCount: chunks.length });
      });
    } else if (widget.kind === "funnel") {
      // O funil fica inteiro numa página só — o total por etapa é o que mais importa de longe num
      // relance de TV, e mesmo o detalhamento por grupo (quando existe) cabe bem num quadro 16:9
      // com a tipografia da versão TV (ver tv-funnel-page.tsx). Se algum dia um board tiver um
      // funil com dezenas de grupos, isso precisa de paginação própria — não é o caso hoje.
      pages.push({ key: widget.id, kind: "funnel", title: widget.title, stages: widget.stages, countsByGroup: widget.countsByGroup });
    } else {
      const chunks = chunk(widget.items, MAX_METRIC_FREE_ITEMS_PER_PAGE);
      chunks.forEach((items, pageIndex) => {
        pages.push({ key: `${widget.id}-${pageIndex}`, kind: "metric_free", title: widget.title, items, pageIndex, pageCount: chunks.length });
      });
    }
  }

  return pages;
}
