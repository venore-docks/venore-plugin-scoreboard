import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { findMappingByRawStatus, findValidStageKeysForBoard, insertMapping } from "./store";
import type { CreatePrimeStatusMappingCommand, CreatePrimeStatusMappingResult } from "./types";

export async function createPrimeStatusMapping(command: CreatePrimeStatusMappingCommand): Promise<CreatePrimeStatusMappingResult> {
  const validStageKeys = await findValidStageKeysForBoard(command.boardId);
  if (!validStageKeys.has(command.stageKey)) {
    return {
      success: false,
      error: {
        code: "scoreboard.prime_mapping.unknown_stage_key",
        message: `A etapa "${command.stageKey}" não existe no funil deste board.`,
      },
    };
  }

  const existing = await findMappingByRawStatus(command.boardId, command.rawStatus);
  if (existing) {
    return {
      success: false,
      error: {
        code: "scoreboard.prime_mapping.duplicate_raw_status",
        message: `O status "${command.rawStatus}" já está mapeado para este board.`,
      },
    };
  }

  const handle = beginOperation({
    useCase: "scoreboard.create-prime-status-mapping",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const mapping = await insertMapping({
    boardId: command.boardId,
    rawStatus: command.rawStatus.trim(),
    stageKey: command.stageKey,
    label: command.label?.trim() || null,
  });

  endOperation(handle, { success: true });
  return { success: true, data: mapping };
}
