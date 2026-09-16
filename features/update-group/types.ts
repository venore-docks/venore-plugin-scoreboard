import type { OperationResult } from "@venore/plugin-sdk";
import type { GroupRecord } from "../../contracts/types";

// key não é editável depois de criada — outros widgets, em qualquer board, já podem estar
// referenciando essa key dentro do próprio config jsonb; mudar a key quebraria essas referências
// em silêncio (nenhum FK físico avisa).
export type UpdateGroupInput = { groupId: string; label?: string; primeSegmentKey?: string | null };
export type UpdateGroupResult = OperationResult<GroupRecord>;
