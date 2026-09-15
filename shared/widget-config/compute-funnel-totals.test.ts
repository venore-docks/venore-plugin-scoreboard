import { describe, expect, it } from "vitest";
import { computeFunnelStageTotals, getFunnelCountsForGroup } from "./compute-funnel-totals";
import { UNGROUPED_KEY } from "./types";

const config = {
  stages: [
    { key: "inscricao", label: "Inscrição", order: 0 },
    { key: "documentacao", label: "Documentação", order: 1 },
    { key: "confirmada", label: "Matrícula Confirmada", order: 2 },
  ],
  countsByGroup: {
    infantil: { inscricao: 40, documentacao: 30, confirmada: 22 },
    "fundamental-1": { inscricao: 28, documentacao: 20, confirmada: 15 },
  },
};

describe("computeFunnelStageTotals", () => {
  it("soma as contagens de todos os grupos por etapa, na ordem das etapas", () => {
    expect(computeFunnelStageTotals(config)).toEqual([
      { key: "inscricao", label: "Inscrição", order: 0, count: 68 },
      { key: "documentacao", label: "Documentação", order: 1, count: 50 },
      { key: "confirmada", label: "Matrícula Confirmada", order: 2, count: 37 },
    ]);
  });

  it("etapa sem nenhuma contagem lançada soma zero, não quebra", () => {
    const totals = computeFunnelStageTotals({ stages: config.stages, countsByGroup: {} });
    expect(totals.every((stage) => stage.count === 0)).toBe(true);
  });
});

describe("getFunnelCountsForGroup", () => {
  it("devolve as contagens do grupo pedido", () => {
    expect(getFunnelCountsForGroup(config, "infantil")).toEqual({ inscricao: 40, documentacao: 30, confirmada: 22 });
  });

  it("usa UNGROUPED_KEY por padrão quando o funil não é segmentado", () => {
    const ungrouped = { stages: config.stages, countsByGroup: { [UNGROUPED_KEY]: { inscricao: 10 } } };
    expect(getFunnelCountsForGroup(ungrouped)).toEqual({ inscricao: 10 });
  });
});
