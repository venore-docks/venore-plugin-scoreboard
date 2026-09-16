import type { OperationResult } from "@venore/plugin-sdk";
import { createBoard } from "../features/create-board/service";
import { findBoardBySlug } from "../features/create-board/store";
import { createGroup } from "../features/create-group/service";
import { findGroupByKey } from "../features/create-group/store";
import { slugify } from "../shared/slug";
import { createWidget } from "../features/create-widget/service";

// Seed de dados de exemplo (mesmo padrão de venore-plugin-birthdays/seeds/example.ts) — chama
// service.ts direto (não o handler via barrel): não existe sessão/ator autenticado neste caminho.
// Idempotente: pula quem já existe (por slug pro board, por key pro grupo do catálogo).
const SEED_ACTOR_ID = "system-seed";

const FUNNEL_STAGE_ORDER = { inscricao: 0, documentacao: 1, aprovado: 1, contrato: 2, confirmada: 3 };

// Cursos/segmentos vivem no catálogo compartilhado agora (features/create-group) — a key real é a
// que o createGroup devolve (slug do label, com sufixo se colidir), nunca um valor inventado aqui.
async function ensureGroup(label: string): Promise<string> {
  const existing = await findGroupByKey(slugify(label));
  if (existing) return existing.key;

  const created = await createGroup({ label, actorId: SEED_ACTOR_ID });
  return created.success ? created.data.key : slugify(label);
}

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

  const infantil = await ensureGroup("Educação Infantil");
  const fundamental1 = await ensureGroup("Fundamental I");
  const fundamental2 = await ensureGroup("Fundamental II");
  const medio = await ensureGroup("Ensino Médio");

  await createWidget({
    boardId: board.data.id,
    kind: "goal_progress",
    title: "Metas por segmento",
    config: {
      groups: [
        { key: infantil, newStudentsGoal: 60, newStudentsActual: 22, retentionTargetPercent: 93, eligibleBase: 180, reenrolledActual: 150 },
        { key: fundamental1, newStudentsGoal: 40, newStudentsActual: 15, retentionTargetPercent: 93, eligibleBase: 220, reenrolledActual: 190 },
        { key: fundamental2, newStudentsGoal: 30, newStudentsActual: 9, retentionTargetPercent: 93, eligibleBase: 200, reenrolledActual: 178 },
        { key: medio, newStudentsGoal: 25, newStudentsActual: 6, retentionTargetPercent: 93, eligibleBase: 150, reenrolledActual: 130 },
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
        [infantil]: { inscricao: 40, documentacao: 30, contrato: 25, confirmada: 22 },
        [fundamental1]: { inscricao: 28, documentacao: 20, contrato: 17, confirmada: 15 },
        [fundamental2]: { inscricao: 18, documentacao: 13, contrato: 10, confirmada: 9 },
        [medio]: { inscricao: 12, documentacao: 9, contrato: 7, confirmada: 6 },
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

  const pedagogia = await ensureGroup("Pedagogia");
  const administracao = await ensureGroup("Administração");
  const direito = await ensureGroup("Direito");

  await createWidget({
    boardId: board.data.id,
    kind: "goal_progress",
    title: "Metas por curso",
    config: {
      groups: [
        { key: pedagogia, newStudentsGoal: 50, newStudentsActual: 18, retentionTargetPercent: 93, eligibleBase: 120, reenrolledActual: 100 },
        { key: administracao, newStudentsGoal: 45, newStudentsActual: 12, retentionTargetPercent: 93, eligibleBase: 140, reenrolledActual: 121 },
        { key: direito, newStudentsGoal: 60, newStudentsActual: 20, retentionTargetPercent: 93, eligibleBase: 200, reenrolledActual: 175 },
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
        [pedagogia]: { inscricao: 30, aprovado: 24, contrato: 20, confirmada: 18 },
        [administracao]: { inscricao: 22, aprovado: 17, contrato: 14, confirmada: 12 },
        [direito]: { inscricao: 35, aprovado: 28, contrato: 23, confirmada: 20 },
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
