import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { slugify } from "../../shared/slug";
import { findGroupByKey, insertGroup } from "./store";
import type { CreateGroupCommand, CreateGroupResult } from "./types";

// Mesmo padrão de generateUniqueSlug em features/create-board/service.ts — key parte do label e
// ganha sufixo numérico só se colidir.
async function generateUniqueKey(label: string): Promise<string> {
  const root = slugify(label) || "curso";
  let candidate = root;
  let attempt = 1;
  while (await findGroupByKey(candidate)) {
    attempt += 1;
    candidate = `${root}-${attempt}`;
  }
  return candidate;
}

export async function createGroup(command: CreateGroupCommand): Promise<CreateGroupResult> {
  const handle = beginOperation({
    useCase: "scoreboard.create-group",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const key = await generateUniqueKey(command.label);
  const group = await insertGroup({ key, label: command.label.trim(), primeSegmentKey: command.primeSegmentKey?.trim() || null });

  endOperation(handle, { success: true });
  return { success: true, data: group };
}
