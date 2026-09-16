import { deleteGroupById, findGroupById, isGroupInUse } from "./store";
import type { DeleteGroupInput, DeleteGroupResult } from "./types";

export async function deleteGroup(input: DeleteGroupInput): Promise<DeleteGroupResult> {
  const group = await findGroupById(input.groupId);
  if (!group) {
    return { success: false, error: { code: "scoreboard.groups.not_found", message: "Curso/segmento não encontrado." } };
  }

  if (await isGroupInUse(group.key)) {
    return {
      success: false,
      error: {
        code: "scoreboard.groups.in_use",
        message: `"${group.label}" ainda está atribuído a pelo menos um widget — remova a atribuição antes de apagar.`,
      },
    };
  }

  await deleteGroupById(input.groupId);
  return { success: true, data: { id: input.groupId } };
}
