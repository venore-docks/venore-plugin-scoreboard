import type { OperationResult } from "@venore/plugin-sdk";
import { createBoard } from "../features/create-board/service";
import { findBoardBySlug } from "../features/create-board/store";
import { createWidget } from "../features/create-widget/service";

// Seed de dados de exemplo (mesmo padrão de venore-plugin-birthdays/seeds/example.ts) — chama
// service.ts direto (não o handler via barrel): não existe sessão/ator autenticado neste caminho.
// Idempotente: pula quem já existe pelo slug.
const SEED_ACTOR_ID = "system-seed";

const FUNNEL_STAGE_ORDER = { inscricao: 0, documentacao: 1, aprovado: 1, contrato: 2, confirmada: 3 };

async function seedErastoBoard(): Promise<void> {
  if (await findBoardBySlug("erasto-2027")) return;

  const board = await createBoard({
    name: "Erasto 2027",
    sector: "Secretaria Acadêmica",
    description: "Campanha de matrícula 2027 — metas por segmento.",
    slug: "erasto-2027",
    actorId: SEED_ACTOR_ID,
  });
  if (!board.success) return;

  await createWidget({
    boardId: board.data.id,
    kind: "goal_progress",
    title: "Metas por segmento",
    config: {
      groups: [
        { key: "infantil", label: "Educação Infantil", newStudentsGoal: 60, newStudentsActual: 22, retentionTargetPercent: 93, eligibleBase: 180, reenrolledActual: 150 },
        { key: "fundamental-1", label: "Fundamental I", newStudentsGoal: 40, newStudentsActual: 15, retentionTargetPercent: 93, eligibleBase: 220, reenrolledActual: 190 },
        { key: "fundamental-2", label: "Fundamental II", newStudentsGoal: 30, newStudentsActual: 9, retentionTargetPercent: 93, eligibleBase: 200, reenrolledActual: 178 },
        { key: "medio", label: "Ensino Médio", newStudentsGoal: 25, newStudentsActual: 6, retentionTargetPercent: 93, eligibleBase: 150, reenrolledActual: 130 },
      ],
    },
    actorId: SEED_ACTOR_ID,
  });

  await createWidget({
    boardId: board.data.id,
    kind: "funnel",
    title: "Funil de matrícula",
    config: {
      stages: [
        { key: "inscricao", label: "Inscrição", order: FUNNEL_STAGE_ORDER.inscricao },
        { key: "documentacao", label: "Documentação", order: FUNNEL_STAGE_ORDER.documentacao },
        { key: "contrato", label: "Contrato + Boleto registrado", order: FUNNEL_STAGE_ORDER.contrato },
        { key: "confirmada", label: "Matrícula Confirmada", order: FUNNEL_STAGE_ORDER.confirmada },
      ],
      countsByGroup: {
        infantil: { inscricao: 40, documentacao: 30, contrato: 25, confirmada: 22 },
        "fundamental-1": { inscricao: 28, documentacao: 20, contrato: 17, confirmada: 15 },
        "fundamental-2": { inscricao: 18, documentacao: 13, contrato: 10, confirmada: 9 },
        medio: { inscricao: 12, documentacao: 9, contrato: 7, confirmada: 6 },
      },
    },
    actorId: SEED_ACTOR_ID,
  });
}

async function seedFidelisBoard(): Promise<void> {
  if (await findBoardBySlug("fidelis-2027-1")) return;

  const board = await createBoard({
    name: "Fidelis 2027.1",
    sector: "Secretaria Acadêmica",
    description: "Campanha de matrícula 2027.1 — metas por curso.",
    slug: "fidelis-2027-1",
    actorId: SEED_ACTOR_ID,
  });
  if (!board.success) return;

  await createWidget({
    boardId: board.data.id,
    kind: "goal_progress",
    title: "Metas por curso",
    config: {
      groups: [
        { key: "pedagogia", label: "Pedagogia", newStudentsGoal: 50, newStudentsActual: 18, retentionTargetPercent: 93, eligibleBase: 120, reenrolledActual: 100 },
        { key: "administracao", label: "Administração", newStudentsGoal: 45, newStudentsActual: 12, retentionTargetPercent: 93, eligibleBase: 140, reenrolledActual: 121 },
        { key: "direito", label: "Direito", newStudentsGoal: 60, newStudentsActual: 20, retentionTargetPercent: 93, eligibleBase: 200, reenrolledActual: 175 },
      ],
    },
    actorId: SEED_ACTOR_ID,
  });

  await createWidget({
    boardId: board.data.id,
    kind: "funnel",
    title: "Funil de matrícula",
    config: {
      stages: [
        { key: "inscricao", label: "Inscrição", order: FUNNEL_STAGE_ORDER.inscricao },
        { key: "aprovado", label: "Aprovado (Vestibular + documentação)", order: FUNNEL_STAGE_ORDER.aprovado },
        { key: "contrato", label: "Contrato + Boleto registrado", order: FUNNEL_STAGE_ORDER.contrato },
        { key: "confirmada", label: "Matrícula Confirmada", order: FUNNEL_STAGE_ORDER.confirmada },
      ],
      countsByGroup: {
        pedagogia: { inscricao: 30, aprovado: 24, contrato: 20, confirmada: 18 },
        administracao: { inscricao: 22, aprovado: 17, contrato: 14, confirmada: 12 },
        direito: { inscricao: 35, aprovado: 28, contrato: 23, confirmada: 20 },
      },
    },
    actorId: SEED_ACTOR_ID,
  });
}

export async function seedScoreboardExample(): Promise<OperationResult<void>> {
  await seedErastoBoard();
  await seedFidelisBoard();
  return { success: true, data: undefined };
}
