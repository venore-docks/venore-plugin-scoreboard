"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { deleteMappingAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function DeleteMappingButton({ boardId, mappingId, rawStatus }: { boardId: string; mappingId: string; rawStatus: string }) {
  const [state, formAction, pending] = useActionState(deleteMappingAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `Mapeamento de "${rawStatus}" removido.` });

  return (
    <form action={formAction}>
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="mappingId" value={mappingId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover mapeamento de ${rawStatus}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
