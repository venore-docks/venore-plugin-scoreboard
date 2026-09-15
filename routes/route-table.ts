import { asPluginApiHandler, asPluginPage, type PluginRouteTable } from "@venore/plugin-sdk";
import AdminBoardsListPage from "./admin/page";
import AdminBoardPage from "./admin-board/page";
import AdminPrimeMappingPage from "./admin-prime-mapping/page";
import AdminPrimeSyncPage from "./admin-prime-sync/page";
import ScoreboardWebPage from "./scoreboard-web/page";
import ScoreboardTvPage from "./scoreboard-tv/page";
import { GET as boardEventsGET } from "./api/board-events/route";
import { GET as boardStateGET } from "./api/board-state/route";
import { POST as syncPOST } from "./api/sync/route";

export const scoreboardRouteTable: PluginRouteTable = {
  admin: [
    { pattern: "", Component: asPluginPage(AdminBoardsListPage) },
    { pattern: "prime-sync", Component: asPluginPage(AdminPrimeSyncPage) },
    { pattern: ":boardId", Component: asPluginPage(AdminBoardPage) },
    { pattern: ":boardId/prime-mapping", Component: asPluginPage(AdminPrimeMappingPage) },
  ],
  // Tela web autenticada, dentro da shell do site — /scoreboard/:slug.
  public: [{ pattern: "scoreboard/:slug", Component: asPluginPage(ScoreboardWebPage) }],
  // Tela TV fullscreen, sem shell — /ext/scoreboard/tv/:slug. É a URL que o Broadcast Studio
  // adiciona como item de playlist "página web"; nenhuma integração de código no broadcast.
  standalone: [{ pattern: "scoreboard/tv/:slug", Component: asPluginPage(ScoreboardTvPage) }],
  api: [
    { pattern: "boards/:boardId/events", handlers: { GET: asPluginApiHandler(boardEventsGET) } },
    { pattern: "boards/:boardId/state", handlers: { GET: asPluginApiHandler(boardStateGET) } },
    { pattern: "sync", handlers: { POST: asPluginApiHandler(syncPOST) } },
  ],
};
