import { describe, expect, it } from "vitest";
import { validateWidgetConfig } from "./validate-widget-config";

describe("validateWidgetConfig — goal_progress", () => {
  it("aceita uma lista vazia de grupos", () => {
    expect(validateWidgetConfig("goal_progress", { groups: [] })).toBeNull();
  });

  it("rejeita chave de grupo duplicada", () => {
    const config = {
      groups: [
        { key: "a", label: "A", newStudentsGoal: 1, newStudentsActual: 0, retentionTargetPercent: 90, eligibleBase: 10, reenrolledActual: 0 },
        { key: "a", label: "A de novo", newStudentsGoal: 1, newStudentsActual: 0, retentionTargetPercent: 90, eligibleBase: 10, reenrolledActual: 0 },
      ],
    };
    expect(validateWidgetConfig("goal_progress", config)?.code).toBe("scoreboard.goal_progress.duplicate_group_key");
  });

  it("rejeita percentual de retenção acima de 100", () => {
    const config = {
      groups: [{ key: "a", label: "A", newStudentsGoal: 1, newStudentsActual: 0, retentionTargetPercent: 150, eligibleBase: 10, reenrolledActual: 0 }],
    };
    expect(validateWidgetConfig("goal_progress", config)?.code).toBe("scoreboard.goal_progress.invalid_percent");
  });

  it("rejeita número negativo em qualquer campo numérico", () => {
    const config = {
      groups: [{ key: "a", label: "A", newStudentsGoal: -1, newStudentsActual: 0, retentionTargetPercent: 90, eligibleBase: 10, reenrolledActual: 0 }],
    };
    expect(validateWidgetConfig("goal_progress", config)?.code).toBe("scoreboard.goal_progress.invalid_number");
  });
});

describe("validateWidgetConfig — funnel", () => {
  it("aceita etapas sem nenhuma contagem lançada ainda", () => {
    const config = { stages: [{ key: "inscricao", label: "Inscrição", order: 0 }], countsByGroup: {} };
    expect(validateWidgetConfig("funnel", config)).toBeNull();
  });

  it("rejeita contagem referenciando uma etapa que não existe", () => {
    const config = {
      stages: [{ key: "inscricao", label: "Inscrição", order: 0 }],
      countsByGroup: { infantil: { etapa_fantasma: 5 } },
    };
    expect(validateWidgetConfig("funnel", config)?.code).toBe("scoreboard.funnel.unknown_stage_key");
  });

  it("rejeita chave de etapa duplicada", () => {
    const config = {
      stages: [
        { key: "inscricao", label: "Inscrição", order: 0 },
        { key: "inscricao", label: "Inscrição de novo", order: 1 },
      ],
      countsByGroup: {},
    };
    expect(validateWidgetConfig("funnel", config)?.code).toBe("scoreboard.funnel.duplicate_stage_key");
  });
});

describe("validateWidgetConfig — metric_free", () => {
  it("aceita uma lista vazia de itens", () => {
    expect(validateWidgetConfig("metric_free", { items: [] })).toBeNull();
  });

  it("rejeita item sem value numérico", () => {
    const config = { items: [{ key: "a", label: "A", value: "não é número" }] };
    expect(validateWidgetConfig("metric_free", config)?.code).toBe("scoreboard.metric_free.invalid_item");
  });
});

describe("validateWidgetConfig — geral", () => {
  it("rejeita config que não é um objeto", () => {
    expect(validateWidgetConfig("goal_progress", null)?.code).toBe("scoreboard.invalid_config");
    expect(validateWidgetConfig("goal_progress", "texto")?.code).toBe("scoreboard.invalid_config");
  });
});
