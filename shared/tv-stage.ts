// "Palco" de composição da tela de TV — mesma técnica de venore-plugin-broadcast/shared/
// output-stage.ts: compõe contra uma LARGURA DE REFERÊNCIA FIXA em CSS px e escala uniformemente
// pro viewport real via `transform: scale(...)`, então 1280x720/1920x1080/4K renderizam o MESMO
// layout, só em tamanhos diferentes.
//
// Por que isso importa aqui especificamente: a tela de TV do scoreboard não é o topo da janela —
// ela roda dentro do <iframe> que o Broadcast Studio usa pro item de playlist "página web"
// (venore-plugin-broadcast/components/output/layer-renderer.tsx, WebpageSlide). Esse iframe
// preenche a "caixa de vídeo" da saída (`h-full w-full`), e essa caixa DEIXA DE SER 16:9 quando a
// coluna de agenda abre (o vídeo encolhe em largura pra abrir espaço — ver o comentário de
// "blurredFill" no mesmo arquivo). `window.innerWidth/innerHeight`, medidos de DENTRO do iframe,
// já refletem o tamanho real da caixa — o mesmo cálculo do broadcast, sem nenhum acoplamento entre
// os dois plugins.
export const TV_STAGE_WIDTH_PX = 1920;
export const TV_STAGE_FALLBACK_HEIGHT_PX = 1080; // 16:9 — o "padrão" quando a caixa não está com a agenda aberta.

export type TvStageTransform = {
  scale: number;
  stageWidthPx: number;
  stageHeightPx: number;
};

const FALLBACK: TvStageTransform = { scale: 1, stageWidthPx: TV_STAGE_WIDTH_PX, stageHeightPx: TV_STAGE_FALLBACK_HEIGHT_PX };

// Entradas degeneradas (0, negativo, NaN — SSR e o primeiro render antes de medir) caem no palco
// 16:9 sem escala: a view aparece composta e legível, nunca em branco.
export function resolveTvStageTransform(viewportWidth: number, viewportHeight: number): TvStageTransform {
  if (!(viewportWidth > 0) || !(viewportHeight > 0)) return FALLBACK;

  const scale = viewportWidth / TV_STAGE_WIDTH_PX;
  const stageHeightPx = viewportHeight / scale;

  return { scale, stageWidthPx: TV_STAGE_WIDTH_PX, stageHeightPx };
}
