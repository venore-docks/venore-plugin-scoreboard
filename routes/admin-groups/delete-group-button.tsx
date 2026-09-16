"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { deleteGroupAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function DeleteGroupButton({ groupId, groupLabel }: { groupId: string; groupLabel: string }) {
  const [state, formAction, pending] = useActionState(deleteGroupAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `${groupLabel} removido.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover "${groupLabel}" do catálogo? Só funciona se não estiver atribuído a nenhum widget.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="groupId" value={groupId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${groupLabel}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
