import type { PluginSeedFn } from "@venore/plugin-sdk";
import { seedScoreboardExample } from "./example";

export const scoreboardSeeds: Record<string, PluginSeedFn> = {
  example: seedScoreboardExample,
};
