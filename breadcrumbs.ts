import type { BreadcrumbSegmentDefinition } from "@venore/plugin-sdk";
import { staticBreadcrumbSegment } from "@venore/plugin-sdk";

export const scoreboardBreadcrumbSegments: BreadcrumbSegmentDefinition[] = [
  staticBreadcrumbSegment({ key: "scoreboard.admin", segments: ["admin", "scoreboard"], label: "Indicadores" }),
  staticBreadcrumbSegment({
    key: "scoreboard.admin.prime-sync",
    segments: ["admin", "scoreboard", "prime-sync"],
    label: "Sincronização Prime",
  }),
  staticBreadcrumbSegment({ key: "scoreboard.web", segments: ["scoreboard"], label: "Indicadores" }),
];
