import type { PluginContributions } from "@venore/plugin-sdk";
import { scoreboardBreadcrumbSegments } from "./breadcrumbs";
import { scoreboardSeeds } from "./seeds";

export const scoreboardContributions: PluginContributions = {
  breadcrumbSegments: scoreboardBreadcrumbSegments,
  seeds: scoreboardSeeds,
  // Painel resumo em /admin — puxa listBoards (handler -> service -> store), então é um loader
  // preguiçoso (mesmo padrão de academyContributions.adminDashboardPanel).
  adminDashboardPanel: async () => {
    const { renderScoreboardAdminDashboardPanel } = await import("./content-slots/admin-dashboard-panel");
    return renderScoreboardAdminDashboardPanel();
  },
};
