"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { deleteWidgetAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function DeleteWidgetButton({ boardId, widgetId, widgetTitle }: { boardId: string; widgetId: string; widgetTitle: string }) {
  const [state, formAction, pending] = useActionState(deleteWidgetAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `Widget "${widgetTitle}" removido.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover o widget "${widgetTitle}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="widgetId" value={widgetId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${widgetTitle}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
