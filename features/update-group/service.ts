import { applyGroupUpdate, findGroupById } from "./store";
import type { UpdateGroupInput, UpdateGroupResult } from "./types";

export async function updateGroup(input: UpdateGroupInput): Promise<UpdateGroupResult> {
  const existing = await findGroupById(input.groupId);
  if (!existing) {
    return { success: false, error: { code: "scoreboard.groups.not_found", message: "Curso/segmento não encontrado." } };
  }
  if (input.label !== undefined && input.label.trim().length === 0) {
    return { success: false, error: { code: "scoreboard.groups.invalid_label", message: "O nome do curso/segmento não pode ser vazio." } };
  }

  const group = await applyGroupUpdate(input.groupId, {
    label: input.label?.trim(),
    primeSegmentKey: input.primeSegmentKey === undefined ? undefined : input.primeSegmentKey?.trim() || null,
  });

  return { success: true, data: group };
}
