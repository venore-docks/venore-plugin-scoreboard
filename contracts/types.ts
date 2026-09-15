export type BoardRecord = {
  id: string;
  slug: string;
  name: string;
  sector: string;
  description: string | null;
  order: number;
  published: boolean;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WidgetKind = "goal_progress" | "funnel" | "metric_free";
export type WidgetDataSource = "manual" | "prime_sync";

// config é jsonb cru — o formato concreto por `kind` é narrado e validado em
// shared/widget-config (nunca no banco). Mesmo racional de BroadcastLayer.config.
export type WidgetRecord = {
  id: string;
  boardId: string;
  kind: WidgetKind;
  title: string;
  order: number;
  dataSource: WidgetDataSource;
  config: Record<string, unknown>;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BoardWithWidgets = BoardRecord & { widgets: WidgetRecord[] };

export type PrimeSyncStatus = "running" | "success" | "failed";

export type PrimeSyncLogRecord = {
  id: string;
  triggeredByUserId: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  status: PrimeSyncStatus;
  studentsFetched: number | null;
  studentsUpserted: number | null;
  boardsRecomputed: string[] | null;
  errorMessage: string | null;
};

export type PrimeStatusMappingRecord = {
  id: string;
  boardId: string;
  rawStatus: string;
  stageKey: string;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Evento publicado em runtime/board-bus.ts sempre que uma mutação muda o estado visível de um
// board — o cliente (web/TV) nunca confia no payload do evento em si, só usa como gatilho pra
// rebuscar o estado calculado via GET .../state (mesmo racional do BroadcastOutputEvent: "!=
// reload -> rebusque o estado inteiro").
export type ScoreboardLiveEvent = { type: "board-changed" } | { type: "reload" };
