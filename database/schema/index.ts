import { sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgSchema, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const scoreboardSchema = pgSchema("scoreboard");

// slug é o identificador público (URL web /scoreboard/:slug e URL TV /ext/scoreboard/tv/:slug) —
// único porque vira parte de URL. sector é texto livre, sem FK: não existe um context
// "setores/departamentos" no core, e um plugin não pode importar schema de outro context (mesma
// regra de birthdays.locality/createdByUserId). published controla se o board aparece nas telas
// web/TV; o admin sempre vê os próprios boards independente disso — dá pra montar um board antes
// de "publicar" pro telão.
export const scoreboardBoards = scoreboardSchema.table(
  "boards",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sector: text("sector").notNull(),
    description: text("description"),
    order: integer("order").notNull().default(0),
    published: boolean("published").notNull().default(false),
    createdByUserId: text("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("scoreboard_boards_slug_idx").on(table.slug)],
);

// Mesmo racional de broadcastAgendaEditors/broadcastOutputEditors/broadcastPlaylistEditors —
// permission correspondente é scoreboard.boards.manage (a estreita). Estar aqui NÃO substitui a
// permission, é uma restrição A MAIS sobre ela (ver shared/scoped-authorization/index.ts):
// precisa das duas coisas — a permission (via papel em /admin/rbac) e a atribuição (via
// set-board-editors, só scoreboard.manage pode mexer nisso).
export const scoreboardBoardEditors = scoreboardSchema.table(
  "board_editors",
  {
    boardId: text("board_id")
      .notNull()
      .references(() => scoreboardBoards.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.boardId, table.userId] })],
);

// Widget polimórfico — kind + config (jsonb livre, formato por kind validado em
// shared/widget-config/validate-widget-config.ts, NÃO no banco). Réplica do padrão
// broadcastLayers (type + CHECK, sem pgEnum): "goal_progress" e "funnel" cobrem o pedido original
// (Erasto/Fidelis); "metric_free" é o kind aberto pra setores futuros com métrica solta, sem meta
// nem funil (requisito explícito do chefe: "vai servir outros setores também").
//
// dataSource: "manual" (formulário no admin) | "prime_sync" (somente leitura na UI, escrito só
// por trigger-prime-sync). lastSyncedAt só é carimbado por esse processo, nunca por
// update-widget/set-widget-manual-value.
export const scoreboardWidgets = scoreboardSchema.table(
  "widgets",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    boardId: text("board_id")
      .notNull()
      .references(() => scoreboardBoards.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull().default(0),
    dataSource: text("data_source").notNull().default("manual"),
    config: jsonb("config").notNull().default({}),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("scoreboard_widgets_kind_check", sql`${table.kind} in ('goal_progress','funnel','metric_free')`),
    check("scoreboard_widgets_data_source_check", sql`${table.dataSource} in ('manual','prime_sync')`),
    index("scoreboard_widgets_board_order_idx").on(table.boardId, table.order),
  ],
);

// Catálogo compartilhado de cursos/segmentos — vive fora de qualquer widget/board de propósito
// (pedido explícito do usuário: "lista única, compartilhada entre quadros"). goal_progress.groups[].key
// e funnel.countsByGroup (dentro do config jsonb dos widgets) passam a referenciar `key` daqui —
// sem FK física possível (o valor vive dentro de um jsonb), a integridade é garantida na camada de
// aplicação: assign-widget-group confirma que a key existe antes de gravar, delete-group recusa
// apagar uma key ainda referenciada por algum widget.
//
// primeSegmentKey mora aqui (não em GoalProgressGroup) porque é propriedade da identidade do
// curso — "como a Prime chama isso" não deveria divergir entre dois widgets/boards que
// representam o mesmo curso.
export const scoreboardGroups = scoreboardSchema.table(
  "groups",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    key: text("key").notNull(),
    label: text("label").notNull(),
    primeSegmentKey: text("prime_segment_key"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("scoreboard_groups_key_idx").on(table.key)],
);

// Auditoria de cada disparo de sync (manual em v1; job agendado é fase futura). status "running"
// é gravado no início da chamada; endOperation/service atualiza no fim — permite a UI do admin
// mostrar "sincronizando..." sem sondar o processo. boardsRecomputed é a lista de boardId (jsonb)
// recalculados nesta rodada.
export const scoreboardPrimeSyncLog = scoreboardSchema.table(
  "prime_sync_log",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    triggeredByUserId: text("triggered_by_user_id"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    status: text("status").notNull().default("running"),
    studentsFetched: integer("students_fetched"),
    studentsUpserted: integer("students_upserted"),
    boardsRecomputed: jsonb("boards_recomputed"),
    errorMessage: text("error_message"),
  },
  (table) => [
    check("scoreboard_prime_sync_log_status_check", sql`${table.status} in ('running','success','failed')`),
    index("scoreboard_prime_sync_log_started_at_idx").on(table.startedAt),
  ],
);

// Staging cru do aluno vindo da Prime — nunca descarta o dado original (requisito explícito do
// usuário). Upsert por externalStudentId (uniqueIndex): cada sync sobrescreve o snapshot mais
// recente do aluno, não acumula histórico linha a linha (o histórico de RODADAS de sync vive em
// prime_sync_log; auditar a evolução aluno-a-aluno viraria uma tabela *_history separada —
// deliberadamente fora do v1).
//
// rawEnrollmentType tem CHECK ('new','reenrollment') — SUPOSIÇÃO, não confirmada: não existe
// payload real da Prime ainda ("vamos ter que criar no escuro"). Se a Prime mandar um valor fora
// desse vocabulário, a linha falha no insert e o sync loga o erro em prime_sync_log — é o sinal
// de que este CHECK (e/ou o parsing em shared/prime-client) precisa ser ajustado quando o payload
// real chegar. rawStatus não tem CHECK nenhum de propósito — é o texto cru, traduzido só via
// prime_status_mapping (editável, por board).
export const scoreboardPrimeStudentRaw = scoreboardSchema.table(
  "prime_student_raw",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    externalStudentId: text("external_student_id").notNull(),
    rawSegmentOrCourse: text("raw_segment_or_course").notNull(),
    rawEnrollmentType: text("raw_enrollment_type").notNull(),
    rawStatus: text("raw_status").notNull(),
    syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
    primeSyncLogId: text("prime_sync_log_id").references(() => scoreboardPrimeSyncLog.id, { onDelete: "set null" }),
  },
  (table) => [
    uniqueIndex("scoreboard_prime_student_raw_external_id_idx").on(table.externalStudentId),
    index("scoreboard_prime_student_raw_segment_idx").on(table.rawSegmentOrCourse),
    check(
      "scoreboard_prime_student_raw_enrollment_type_check",
      sql`${table.rawEnrollmentType} in ('new','reenrollment')`,
    ),
  ],
);

// Tradução status-cru-da-Prime -> etapa-nossa, EDITÁVEL NO ADMIN (requisito explícito — "não
// hardcoded em código"), escopada por board (não global): Erasto e Fidelis têm vocabulário de
// funil diferente ("Documentação" vs "Aprovado"), então o MESMO rawStatus pode mapear pra
// stageKeys diferentes em cada board. stageKey é texto livre (sem CHECK fixo) porque as etapas do
// funil são configuráveis por widget (FunnelStage.key) — validado em service.ts contra os stages
// atuais do widget "funnel" daquele board, não no banco.
export const scoreboardPrimeStatusMapping = scoreboardSchema.table(
  "prime_status_mapping",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    boardId: text("board_id")
      .notNull()
      .references(() => scoreboardBoards.id, { onDelete: "cascade" }),
    rawStatus: text("raw_status").notNull(),
    stageKey: text("stage_key").notNull(),
    label: text("label"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("scoreboard_prime_status_mapping_board_raw_idx").on(table.boardId, table.rawStatus)],
);
