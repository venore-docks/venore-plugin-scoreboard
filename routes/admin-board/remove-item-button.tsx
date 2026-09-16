"use client";

import { useActionState } from "react";
import { X } from "lucide-react";
import { Button, useActionToast } from "@venore/plugin-sdk/ui";
import { removeWidgetItemAction, type ScoreboardActionState } from "./actions";

const initialState: ScoreboardActionState = { error: null };

export function RemoveItemButton({
  boardId,
  widgetId,
  kind,
  itemKey,
  itemLabel,
}: {
  boardId: string;
  widgetId: string;
  kind: "funnel" | "metric_free";
  itemKey: string;
  itemLabel: string;
}) {
  const [state, formAction, pending] = useActionState(removeWidgetItemAction, initialState);
  useActionToast({ pending, error: state.error, successMessage: `"${itemLabel}" removido.` });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remover "${itemLabel}"? Os números já lançados pra ele se perdem.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="boardId" value={boardId} />
      <input type="hidden" name="widgetId" value={widgetId} />
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="key" value={itemKey} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} aria-label={`Remover ${itemLabel}`} className="size-6">
        <X className="size-3.5" />
      </Button>
    </form>
  );
}
