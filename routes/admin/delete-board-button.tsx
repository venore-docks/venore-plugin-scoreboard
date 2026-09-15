"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { deleteBoardAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function DeleteBoardButton({ boardId, boardName }: { boardId: string; boardName: string }) {
  const [state, formAction, pending] = useActionState(deleteBoardAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${boardName} removido.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover o quadro "${boardName}"? Todos os widgets dele somem junto.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="boardId" value={boardId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${boardName}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
