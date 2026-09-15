export { scoreboardBreadcrumbSegments } from "./breadcrumbs";

export { createBoardHandler as createBoard } from "./features/create-board/handler";
export { updateBoardHandler as updateBoard } from "./features/update-board/handler";
export { deleteBoardHandler as deleteBoard } from "./features/delete-board/handler";
export { setBoardEditorsHandler as setBoardEditors } from "./features/set-board-editors/handler";
export { listBoardsHandler as listBoards } from "./features/list-boards/handler";
export { getBoardHandler as getBoard } from "./features/get-board/handler";
export { getBoardViewHandler as getBoardView } from "./features/get-board-view/handler";

export { createWidgetHandler as createWidget } from "./features/create-widget/handler";
export { updateWidgetHandler as updateWidget } from "./features/update-widget/handler";
export { deleteWidgetHandler as deleteWidget } from "./features/delete-widget/handler";
export { reorderWidgetsHandler as reorderWidgets } from "./features/reorder-widgets/handler";
export {
  setWidgetManualValueHandler as setWidgetManualValue,
} from "./features/set-widget-manual-value/handler";

export {
  listPrimeStatusMappingHandler as listPrimeStatusMapping,
} from "./features/list-prime-status-mapping/handler";
export {
  createPrimeStatusMappingHandler as createPrimeStatusMapping,
} from "./features/create-prime-status-mapping/handler";
export {
  updatePrimeStatusMappingHandler as updatePrimeStatusMapping,
} from "./features/update-prime-status-mapping/handler";
export {
  deletePrimeStatusMappingHandler as deletePrimeStatusMapping,
} from "./features/delete-prime-status-mapping/handler";

export { triggerPrimeSyncHandler as triggerPrimeSync } from "./features/trigger-prime-sync/handler";
export { getPrimeSyncStatusHandler as getPrimeSyncStatus } from "./features/get-prime-sync-status/handler";

export { scoreboardSeeds } from "./seeds";

export { subscribeToBoardEvents, publishBoardEvent } from "./runtime/board-bus";
export { findBoardIdBySlug } from "./shared/find-board-id-by-slug";

export { WIDGET_KINDS, UNGROUPED_KEY, emptyWidgetConfig } from "./shared/widget-config/types";
export type {
  WidgetConfigByKind,
  GoalProgressGroup,
  GoalProgressWidgetConfig,
  FunnelStage,
  FunnelWidgetConfig,
  MetricFreeItem,
  MetricFreeWidgetConfig,
} from "./shared/widget-config/types";

export type {
  BoardRecord,
  WidgetRecord,
  WidgetKind,
  WidgetDataSource,
  BoardWithWidgets,
  PrimeSyncLogRecord,
  PrimeStatusMappingRecord,
  ScoreboardLiveEvent,
} from "./contracts/types";

export type { CreateBoardInput, CreateBoardResult } from "./features/create-board/types";
export type { UpdateBoardInput, UpdateBoardResult } from "./features/update-board/types";
export type { DeleteBoardInput, DeleteBoardResult } from "./features/delete-board/types";
export type { SetBoardEditorsInput, SetBoardEditorsResult } from "./features/set-board-editors/types";
export type { ListBoardsResult } from "./features/list-boards/types";
export type { GetBoardInput, GetBoardResult } from "./features/get-board/types";
export type { BoardView, BoardViewWidget, GetBoardViewInput, GetBoardViewResult } from "./features/get-board-view/types";

export type { CreateWidgetInput, CreateWidgetResult } from "./features/create-widget/types";
export type { UpdateWidgetInput, UpdateWidgetResult } from "./features/update-widget/types";
export type { DeleteWidgetInput, DeleteWidgetResult } from "./features/delete-widget/types";
export type { ReorderWidgetsInput, ReorderWidgetsResult } from "./features/reorder-widgets/types";
export type {
  SetWidgetManualValueInput,
  SetWidgetManualValueResult,
} from "./features/set-widget-manual-value/types";

export type {
  ListPrimeStatusMappingInput,
  ListPrimeStatusMappingResult,
} from "./features/list-prime-status-mapping/types";
export type {
  CreatePrimeStatusMappingInput,
  CreatePrimeStatusMappingResult,
} from "./features/create-prime-status-mapping/types";
export type {
  UpdatePrimeStatusMappingInput,
  UpdatePrimeStatusMappingResult,
} from "./features/update-prime-status-mapping/types";
export type {
  DeletePrimeStatusMappingInput,
  DeletePrimeStatusMappingResult,
} from "./features/delete-prime-status-mapping/types";

export type { TriggerPrimeSyncResult } from "./features/trigger-prime-sync/types";
export type { GetPrimeSyncStatusResult } from "./features/get-prime-sync-status/types";
