import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { slugify } from "../../shared/slug";
import { findBoardBySlug, insertBoard } from "./store";
import type { CreateBoardCommand, CreateBoardResult } from "./types";

// Slug parte do nome (ou do slug sugerido) e ganha sufixo numérico só se colidir — mesmo padrão
// de venore-plugin-academy/features/courses/create-course/service.ts (generateUniqueSlug).
async function generateUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "quadro";
  let candidate = root;
  let attempt = 1;
  while (await findBoardBySlug(candidate)) {
    attempt += 1;
    candidate = `${root}-${attempt}`;
  }
  return candidate;
}

export async function createBoard(command: CreateBoardCommand): Promise<CreateBoardResult> {
  const handle = beginOperation({
    useCase: "scoreboard.create-board",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const slug = await generateUniqueSlug(command.slug?.trim() || command.name);

  const board = await insertBoard({
    name: command.name.trim(),
    sector: command.sector.trim(),
    description: command.description?.trim() || null,
    slug,
    createdByUserId: command.actorId,
  });

  endOperation(handle, { success: true });
  return { success: true, data: board };
}
