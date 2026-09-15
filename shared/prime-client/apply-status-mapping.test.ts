import { describe, expect, it } from "vitest";
import { applyStatusMapping } from "./apply-status-mapping";
import { UNGROUPED_KEY } from "../widget-config/types";
import type { PrimeStudentDTO } from "./types";

const students: PrimeStudentDTO[] = [
  { externalId: "1", segmentOrCourse: "infantil", enrollmentType: "new", rawStatus: "MATRICULA_CONFIRMADA" },
  { externalId: "2", segmentOrCourse: "infantil", enrollmentType: "reenrollment", rawStatus: "MATRICULA_CONFIRMADA" },
  { externalId: "3", segmentOrCourse: "infantil", enrollmentType: "new", rawStatus: "INSCRITO" },
  { externalId: "4", segmentOrCourse: "curso-desconhecido", enrollmentType: "new", rawStatus: "MATRICULA_CONFIRMADA" },
  { externalId: "5", segmentOrCourse: "infantil", enrollmentType: "new", rawStatus: "STATUS_SEM_MAPEAMENTO" },
];

const statusMapping = [
  { rawStatus: "INSCRITO", stageKey: "inscricao" },
  { rawStatus: "MATRICULA_CONFIRMADA", stageKey: "confirmada" },
];

const groups = [{ groupKey: "infantil", primeSegmentKey: "infantil" }];

describe("applyStatusMapping", () => {
  it("conta os alunos mapeados por etapa e grupo", () => {
    const result = applyStatusMapping({ students, statusMapping, groups, terminalStageKey: "confirmada" });

    expect(result.funnelCountsByGroup.infantil).toEqual({ confirmada: 2, inscricao: 1 });
  });

  it("conta separadamente novos e rematrículas na etapa terminal", () => {
    const result = applyStatusMapping({ students, statusMapping, groups, terminalStageKey: "confirmada" });

    expect(result.terminalCountsByGroup.infantil).toEqual({ new: 1, reenrollment: 1 });
  });

  it("reporta status sem mapeamento em vez de descartar em silêncio", () => {
    const result = applyStatusMapping({ students, statusMapping, groups, terminalStageKey: "confirmada" });

    expect(result.unmappedStatuses).toEqual(["STATUS_SEM_MAPEAMENTO"]);
  });

  it("reporta segmento sem grupo correspondente em vez de descartar em silêncio", () => {
    const result = applyStatusMapping({ students, statusMapping, groups, terminalStageKey: "confirmada" });

    expect(result.unmappedSegments).toEqual(["curso-desconhecido"]);
  });

  it("sem nenhum grupo cadastrado, agrupa tudo em UNGROUPED_KEY", () => {
    const result = applyStatusMapping({ students, statusMapping, groups: [], terminalStageKey: "confirmada" });

    expect(result.funnelCountsByGroup[UNGROUPED_KEY]).toEqual({ confirmada: 3, inscricao: 1 });
    expect(result.unmappedSegments).toEqual([]);
  });
});
