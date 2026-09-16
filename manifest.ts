import type { PluginManifest } from "@venore/plugin-sdk";

// Faixa escrita à mão, não importada de platform/plugin-engine/core-version.ts — mesmo motivo do
// birthdaysManifest/academyManifest: importar o CORE_VERSION corrente tornaria a checagem de
// compatibilidade sempre trivialmente satisfeita.
export const scoreboardManifest: PluginManifest = {
  manifestVersion: "1.0.0",
  key: "scoreboard",
  name: "Telas de Indicadores",
  version: "1.1.0",
  description:
    "Quadros de metas, funil de matrícula e métricas livres por setor, publicáveis na web e como tela de TV via Broadcast Studio.",
  compatibility: { coreVersion: ">=2.0.0 <3.0.0" },
  // Schema próprio do plugin — aplicado no install (run-plugin-migrations.ts), não no
  // vercel-build. Default de migrationsSchema ("scoreboard_migrations") já bate com
  // drizzle.config.ts.
  migrationsPath: "./migrations",
  permissions: [
    { key: "scoreboard.read", label: "Ver os quadros de indicadores publicados" },
    { key: "scoreboard.manage", label: "Gerenciar todos os quadros, widgets e a sincronização com a Prime" },
    {
      key: "scoreboard.boards.manage",
      label: "Editar apenas os quadros atribuídos ao usuário no Scoreboard (sem acesso ao restante)",
    },
  ],
  navigation: [
    {
      key: "scoreboard.admin",
      label: "Indicadores",
      href: "/admin/scoreboard",
      icon: "gauge",
      groupKey: "plugins",
      groupLabel: "Plugins",
      groupOrder: 30,
      order: 25,
      requiredPermission: ["scoreboard.manage", "scoreboard.boards.manage"],
    },
  ],
  seeds: [
    {
      key: "example",
      label: "Dados de exemplo",
      description: 'Quadros "Erasto 2027" e "Fidelis 2027.1" com metas, funil e valores manuais preenchidos.',
    },
  ],
};
