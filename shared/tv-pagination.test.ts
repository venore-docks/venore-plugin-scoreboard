import { describe, expect, it } from "vitest";
import { buildTvPages } from "./tv-pagination";
import type { BoardViewWidget } from "../features/get-board-view/types";

function goalGroup(key: string) {
  return {
    key,
    label: key,
    newStudentsGoal: 10,
    newStudentsActual: 5,
    retentionTargetPercent: 93,
    eligibleBase: 20,
    reenrolledActual: 10,
    reenrollmentGoal: 19,
    newStudentsAchievedPercent: 50,
    reenrollmentAchievedPercent: 53,
  };
}

describe("buildTvPages", () => {
  it("mantém um widget funnel sempre numa única página", () => {
    const widget: BoardViewWidget = {
      id: "w1",
      kind: "funnel",
      title: "Funil",
      order: 0,
      dataSource: "manual",
      lastSyncedAt: null,
      stages: [{ key: "a", label: "A", order: 0 }],
      countsByGroup: {},
    };

    expect(buildTvPages([widget])).toEqual([
      { key: "w1", kind: "funnel", title: "Funil", stages: widget.stages, countsByGroup: {} },
    ]);
  });

  it("divide um widget goal_progress com mais de 4 grupos em várias páginas", () => {
    const widget: BoardViewWidget = {
      id: "w2",
      kind: "goal_progress",
      title: "Metas",
      order: 0,
      dataSource: "manual",
      lastSyncedAt: null,
      groups: [goalGroup("a"), goalGroup("b"), goalGroup("c"), goalGroup("d"), goalGroup("e")],
    };

    const pages = buildTvPages([widget]);
    expect(pages).toHaveLength(2);
    expect(pages[0]).toMatchObject({ kind: "goal_progress", pageIndex: 0, pageCount: 2 });
    expect(pages[0].kind === "goal_progress" && pages[0].groups.map((g) => g.key)).toEqual(["a", "b", "c", "d"]);
    expect(pages[1].kind === "goal_progress" && pages[1].groups.map((g) => g.key)).toEqual(["e"]);
  });

  it("um widget goal_progress sem nenhum grupo ainda gera uma página vazia (não some)", () => {
    const widget: BoardViewWidget = {
      id: "w3",
      kind: "goal_progress",
      title: "Metas",
      order: 0,
      dataSource: "manual",
      lastSyncedAt: null,
      groups: [],
    };

    expect(buildTvPages([widget])).toEqual([{ key: "w3-0", kind: "goal_progress", title: "Metas", groups: [], pageIndex: 0, pageCount: 1 }]);
  });
});
