import { describe, expect, it } from "vitest";
import { computeAchievedPercent, computeReenrollmentGoal, summarizeGoalProgressGroup } from "./compute-goal-progress";
import type { GoalProgressGroup } from "./types";

function group(overrides: Partial<GoalProgressGroup> = {}): GoalProgressGroup {
  return {
    key: "infantil",
    label: "Educação Infantil",
    newStudentsGoal: 60,
    newStudentsActual: 30,
    retentionTargetPercent: 93,
    eligibleBase: 200,
    reenrolledActual: 170,
    ...overrides,
  };
}

describe("computeReenrollmentGoal", () => {
  it("arredonda base elegível * percentual de retenção", () => {
    expect(computeReenrollmentGoal({ eligibleBase: 200, retentionTargetPercent: 93 })).toBe(186);
  });

  it("nunca é armazenado — sempre recalculado a partir da base e do percentual", () => {
    expect(computeReenrollmentGoal({ eligibleBase: 0, retentionTargetPercent: 93 })).toBe(0);
  });
});

describe("computeAchievedPercent", () => {
  it("calcula o percentual com uma casa decimal", () => {
    expect(computeAchievedPercent(30, 60)).toBe(50);
    expect(computeAchievedPercent(1, 3)).toBe(33.3);
  });

  it("devolve null quando a meta é zero, em vez de dividir por zero", () => {
    expect(computeAchievedPercent(10, 0)).toBeNull();
  });
});

describe("summarizeGoalProgressGroup", () => {
  it("combina o grupo cru com a meta de rematrícula e os percentuais calculados", () => {
    const summary = summarizeGoalProgressGroup(group());

    expect(summary.reenrollmentGoal).toBe(186);
    expect(summary.newStudentsAchievedPercent).toBe(50);
    expect(summary.reenrollmentAchievedPercent).toBeCloseTo(91.4, 1);
  });
});
