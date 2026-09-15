import { authorizeActor, type AuthorizeActorResult } from "@venore/plugin-sdk/rbac";
import { findBoardIdByMappingId, findBoardIdByWidgetId, findBoardIdsAssignedToUser, isUserAssignedToBoard } from "./store";

const FORBIDDEN_BOARD_ERROR = {
  code: "scoreboard.boards.forbidden_resource",
  message: "Você só tem permissão para acessar os quadros atribuídos a você.",
};

const WIDGET_NOT_FOUND_ERROR = {
  code: "scoreboard.widgets.not_found",
  message: "Widget não encontrado.",
};

const MAPPING_NOT_FOUND_ERROR = {
  code: "scoreboard.prime_mapping.not_found",
  message: "Mapeamento não encontrado.",
};

// Camada de autorização por recurso — mesmo racional de authorizeAgendaActor/authorizeOutputActor
// do broadcast: scoreboard.manage sempre passa (acesso total, sem checar atribuição nenhuma).
// Quem só tem a permission estreita (scoreboard.boards.manage) ainda precisa estar EXPLICITAMENTE
// atribuído ao board — a atribuição por si só nunca é suficiente, precisa das duas coisas: a
// permission (via papel em /admin/rbac) e a atribuição (via set-board-editors, só
// scoreboard.manage pode mexer nisso).
export async function authorizeBoardActor(boardId: string): Promise<AuthorizeActorResult> {
  const full = await authorizeActor("scoreboard.manage");
  if (full.authorized) return full;

  const scoped = await authorizeActor("scoreboard.boards.manage");
  if (!scoped.authorized) return scoped;

  const assigned = await isUserAssignedToBoard(boardId, scoped.actorId);
  if (!assigned) return { authorized: false, error: FORBIDDEN_BOARD_ERROR };
  return scoped;
}

// Leitura (tela web, TV, SSE, snapshot de estado): scoreboard.read é a permission "só ver" — passa
// sem checar atribuição, já que serve pra qualquer board publicado. Quem só tem a permission
// estreita de edição (scoreboard.boards.manage) também pode VER os próprios boards atribuídos
// (editar implica poder ver) — não criamos uma quarta permission "scoreboard.boards.read" só pra
// isso.
export async function authorizeBoardReadActor(boardId: string): Promise<AuthorizeActorResult> {
  const full = await authorizeActor(["scoreboard.manage", "scoreboard.read"]);
  if (full.authorized) return full;

  const scoped = await authorizeActor("scoreboard.boards.manage");
  if (!scoped.authorized) return scoped;

  const assigned = await isUserAssignedToBoard(boardId, scoped.actorId);
  if (!assigned) return { authorized: false, error: FORBIDDEN_BOARD_ERROR };
  return scoped;
}

// create-widget já recebe boardId direto (usa authorizeBoardActor acima); update-widget/
// delete-widget/set-widget-manual-value só recebem widgetId — resolve o pai antes de checar
// atribuição (mesmo padrão de authorizeAgendaEventActor do broadcast).
export async function authorizeWidgetActor(widgetId: string): Promise<AuthorizeActorResult> {
  const boardId = await findBoardIdByWidgetId(widgetId);
  if (!boardId) {
    return { authorized: false, error: WIDGET_NOT_FOUND_ERROR };
  }
  return authorizeBoardActor(boardId);
}

export async function authorizeMappingActor(mappingId: string): Promise<AuthorizeActorResult> {
  const boardId = await findBoardIdByMappingId(mappingId);
  if (!boardId) {
    return { authorized: false, error: MAPPING_NOT_FOUND_ERROR };
  }
  return authorizeBoardActor(boardId);
}

export { findBoardIdsAssignedToUser };
